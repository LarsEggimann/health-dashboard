import asyncio
from fastapi import WebSocket
import numpy as np
import time
from pathlib import Path
from sqlmodel import Session
import pandas as pd

from app.models.current_data import CurrentDataResponse


import pyvisa
from pyvisa.resources import TCPIPSocket


main_working_directory = Path(__file__).parent.parent

OVERFLOW_UPPER_LIMIT = 1e35


class KeysightEM:
    def __init__(self, session: Session):
        self.session = session

        self.rm = pyvisa.ResourceManager("@py")
        self.my_instrument: TCPIPSocket = self.connect_to_keysight_em()  # type: ignore

        self.time_list: list[str] = []
        self.current_list: list[str] = []

        self.continuous_measurement_task = None
        self.continuous_measurement_interval = 0.1

        self.COUN = "500"
        self.TIM = "0.01"
        self.BYP = "OFF"
        self.DEL = "0.000000"

        self.FUNC = "CURR"
        self.APER = "0.2"
        self.APER_AUTO = "OFF"
        self.AUTO_MODE = "LONG"
        self.RANG = "0.000000100"
        self.RANG_AUTO = "OFF"
        self.AUTO_ULIM = "0.000100000"
        self.AUTO_LLIM = "0.000000010"

        print("Keysight EM Controller initialized")

        self.latest_time = 0
        self.websocket: WebSocket | None = None

        self.init_settings()

    def set_websocket(self, websocket: WebSocket):
        """
        Set the websocket connection for the electrometer service
        """
        self.websocket = websocket

    def init_settings(self):
        self.write_and_log("*CLS")
        self.write_and_log("*RST")

        self.write_and_log(
            ":FORM ASC;:FORM:DIG ASC;:FORM:ELEM:CALC CALC,TIME,STAT;:FORM:SREG ASC;"
        )

        self.set_sensor()

        self.set_trigger()

    async def start_continuous_measurement(self):
        await self.stop_continuous_measurement()

        self.TIM = 0.01
        self.COUN = 1
        self.set_trigger()

        self.enable_io()
        self.continuous_measurement_task = asyncio.create_task(self.measure())

    async def stop_continuous_measurement(self):
        self.turn_off_io()
        if self.continuous_measurement_task:
            self.continuous_measurement_task.cancel()

            self.TIM = "0.01"
            self.COUN = "500"
            self.set_trigger()

    async def measure(self):
        while True:
            self.my_instrument.write(":INIT:ACQ (@1);")
            await asyncio.sleep(float(self.continuous_measurement_interval))
            cur = self.my_instrument.query(":FETC:CURR? (@1)")
            # t = self.my_instrument.query(":FETC? (@1);")
            # print(f"Time: {t}")
            try:
                self.time_list = [time.time()]
                self.current_list = [cur]
                self.save_data_to_file()
            except Exception as e:
                print("Error in converting data to float: %s", e)

    def do_trigger_based_measurement(self):
        self.enable_io()
        self.write_and_log(":INIT:ALL (@1);")
        wait_time = int(float(self.COUN) * float(self.TIM))
        print(f"Waiting for {wait_time} seconds to retrieve data")
        start = time.time()
        while time.time() - start < wait_time:
            time.sleep(0.2)
            print(
                f"Keysight controller info: {(time.time() - start):.2f} / {wait_time:.2f} seconds measurement time",
                end="\r",
            )
        self.get_trigger_based_data(start)

    def set_trigger(self):
        self.write_and_log(
            f":TRIG1:ALL:SOUR TIM;COUN {self.COUN};TIM {self.TIM};BYP {self.BYP};DEL {self.DEL}"
        )

    def set_sensor(self):
        #             ":SENS1:CURR:RANG 0.002000;RANG:AUTO OFF;AUTO:ULIM 0.020000;LLIM 0.0001"

        self.write_and_log(
            f':SENS1:FUNC "{self.FUNC}",;:SENS1:CURR:APER {self.APER};APER:AUTO {self.APER_AUTO};AUTO:MODE {self.AUTO_MODE}'
        )
        if self.RANG_AUTO == "ON":
            self.write_and_log(
                f":SENS1:CURR:RANG:AUTO {self.RANG_AUTO};AUTO:ULIM {self.AUTO_ULIM};LLIM {self.AUTO_LLIM}"
            )
        else:
            self.write_and_log(
                f":SENS1:CURR:RANG {self.RANG};RANG:AUTO {self.RANG_AUTO}"
            )

    def enable_io(self):
        self.write_and_log(":OUTP1 ON;")
        self.write_and_log(":INP1 ON;")

    def turn_off_io(self):
        self.write_and_log(":OUTP1 OFF;")
        self.write_and_log(":INP1 OFF;")

    def connect_to_keysight_em(self, ip="192.168.113.72") -> TCPIPSocket:
        try:
            instr: TCPIPSocket = self.rm.open_resource(f"TCPIP::{ip}::5025::SOCKET")  # type: ignore

            # For Serial and TCP/IP socket connections enable the read Termination Character, or read's will timeout
            if instr.resource_name.startswith("ASRL") or instr.resource_name.endswith(
                "SOCKET"
            ):
                instr.read_termination = "\n"

            print("Connected to Keysight EM")

        except pyvisa.errors.VisaIOError as e:
            print("Could not connect to Keysight EM: %s", e)
            raise e

        return instr

    def save_data_to_file(self):
        # current_data_list: list[CurrentData] = zip(self.time_list, self.current_list)

        df = pd.DataFrame({"time": self.time_list, "current": self.current_list})

        if not df.empty:
            # Get the SQLAlchemy engine from the session
            engine = self.session.get_bind()

            # Insert directly using pandas to_sql - vectorized operation
            df.to_sql(
                name="em_current_data", con=engine, if_exists="append", index=False
            )

            # Commit the transaction if needed
            self.session.commit()

        if self.websocket and self.websocket.client_state != 2:
            self.latest_time = float(self.time_list[-1]) if self.time_list else 0
            asyncio.create_task(
                self.websocket.send_json(
                    CurrentDataResponse(
                        current=self.current_list,
                        time=self.time_list,
                    ).model_dump_json()
                )
            )
        # Clear the lists after saving

        self.time_list.clear()
        self.current_list.clear()

    def get_trigger_based_data(self, start_time: float = 0):
        times = self.my_instrument.query(":FETCH:ARR:TIME? (@1);")
        cur = self.my_instrument.query(":FETCH:ARR:CURR? (@1);")
        time_list = times.split(",")
        current_list = cur.split(",")
        try:
            time_arr = np.array(time_list, dtype=float) + start_time
            self.time_list = time_arr.tolist()  # type: ignore
            self.current_list = current_list
            self.save_data_to_file()
            self.turn_off_io()
        except Exception as e:
            print("Error in converting data to float: %s", e)

    async def health_check(self) -> bool:
        try:
            self.my_instrument.query("*IDN?")
            error_request = self.my_instrument.query("SYST:ERR?")
            if error_request != '+0,"No error"':
                print("Error: %s", error_request)
                # clear error
                self.write_and_log("*CLS")
            return True
        except Exception as e:
            print("Error during health check: %s", e)
            return False

    def query_and_log(self, command: str):
        try:
            response = self.my_instrument.query(command)
            if command.startswith(":STAT"):
                print(
                    "Query to EM: %s -> Response: %s",
                    command,
                    f"0b{int(response):016b}",
                )
            else:
                print("Query to EM: %s -> Response: %s", command, response)

            error_request = self.my_instrument.query("SYST:ERR?")
            if error_request != '+0,"No error"':
                print("Error: %s", error_request)
            return response
        except pyvisa.errors.VisaIOError as e:
            print("Query: %s -> Error: %s", command, e)
            return str(e)

    def write_and_log(self, command: str):
        try:
            self.my_instrument.write(command)
            print("Write to EM: %s", command)
            error_request = self.my_instrument.query("SYST:ERR?")
            if error_request != '+0,"No error"':
                print("Error: %s", error_request)
                self.write_and_log("*CLS")
        except pyvisa.errors.VisaIOError as e:
            print("Write: %s -> Error: %s", command, e)
