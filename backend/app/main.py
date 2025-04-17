from fastapi import FastAPI, APIRouter, WebSocket, BackgroundTasks
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import json
from sqlmodel import select, asc

from app.core.config import settings
from app.core.db import init_db
from app.routers import auth, private, health_data_management
from app.routers import user

from app.core.electrometer.electrometer_service import KeysightEM
from app.deps import SessionDep, TimeFrameInputDep
from app.models.current_data import CurrentData, CurrentDataResponse
from app.routers import monitoring

api_router = APIRouter()
api_router.include_router(health_data_management.router)
api_router.include_router(monitoring.router)
api_router.include_router(auth.router)
api_router.include_router(user.router)

if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # setup database

    init_db()

    yield  # run the app

    # cleanup


app = FastAPI(
    title="Health Dashboard API",
    generate_unique_id_function=custom_generate_unique_id,
    lifespan=lifespan,
)

app.include_router(api_router, prefix=settings.API_V1_STR)

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


active_connections: list[WebSocket] = []

electrometer_router = APIRouter(
    prefix="/electrometer",
    tags=["Electrometer"],
)

electrometer_service: KeysightEM | None = None


@electrometer_router.get("/test/electrometer-1/connect")
async def test_connect_to_electrometer_1(session: SessionDep):
    """
    Test connection to the first electrometer
    """
    global electrometer_service
    electrometer_service = KeysightEM(session=session)

    return {
        "status": "success",
        "message": "Connected to the first electrometer",
    }


@electrometer_router.get(
    "/test/electrometer-1/get-data", response_model=CurrentDataResponse
)
async def test_get_data_electrometer_1(
    session: SessionDep, time_frame: TimeFrameInputDep
):
    """
    Test getting data from the first electrometer
    """
    statement = select(CurrentData.time, CurrentData.current)

    if time_frame.start:
        statement = statement.where(CurrentData.time >= time_frame.start.timestamp())
    if time_frame.end:
        statement = statement.where(CurrentData.time <= time_frame.end.timestamp())

    # sort by timestamp ascending
    statement = statement.order_by(asc(CurrentData.time))

    session_hr = session.exec(statement).all()

    time, current = zip(*session_hr) if session_hr else ([], [])

    return CurrentDataResponse(
        current=list(current),
        time=list(time),
    )


@electrometer_router.get("/test/electrometer-1/trigger-measure")
async def test_trigger_measure_electrometer_1(background_tasks: BackgroundTasks):
    """
    Test triggering a measurement on the first electrometer
    """
    global electrometer_service
    if electrometer_service is None:
        return {
            "status": "error",
            "message": "Electrometer service not initialized",
        }

    background_tasks.add_task(electrometer_service.do_trigger_based_measurement)

    return {
        "status": "running",
        "message": "Triggered measurement on the first electrometer",
    }


@electrometer_router.get("/test/electrometer-1/continuous-measure/start")
async def test_start_continuous_measure_electrometer_1(
    background_tasks: BackgroundTasks,
):
    """
    Test starting continuous measurement on the first electrometer
    """
    global electrometer_service
    if electrometer_service is None:
        return {
            "status": "error",
            "message": "Electrometer service not initialized",
        }
    await electrometer_service.start_continuous_measurement()
    return {
        "status": "running",
        "message": "Started continuous measurement on the first electrometer",
    }


@electrometer_router.get("/test/electrometer-1/continuous-measure/stop")
async def test_stop_continuous_measure_electrometer_1():
    """
    Test stopping continuous measurement on the first electrometer
    """
    global electrometer_service
    if electrometer_service is None:
        return {
            "status": "error",
            "message": "Electrometer service not initialized",
        }
    await electrometer_service.stop_continuous_measurement()
    return {
        "status": "stopped",
        "message": "Stopped continuous measurement on the first electrometer",
    }


app.include_router(electrometer_router)


@app.websocket("/ws")
async def test_websockets(websocket: WebSocket):
    """
    WebSocket testing
    """
    await websocket.accept()
    active_connections.append(websocket)

    global electrometer_service

    if electrometer_service is not None:
        electrometer_service.set_websocket(websocket)

    try:
        while True:
            data = await websocket.receive_text()

            print(f"Received data: {data}")

            await websocket.send_text(
                json.dumps(
                    {
                        "message": "Data received",
                        "data": data,
                    }
                )
            )

    except Exception as e:
        print(f"Error: {e}")

    finally:
        active_connections.remove(websocket)
        print("Client disconnected")
