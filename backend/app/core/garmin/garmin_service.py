import os
import multiprocessing

from app.models.garmin import UpdateProcessStatus


def _update_local_db_command():
    """
    Update local db command
    """
    os.system("garmindb_cli.py --all --download --import --analyze --latest")


class ProcessManager:
    """
    Process manager
    """

    def __init__(self):
        self._process: multiprocessing.Process = self._get_new_process()

    def _get_new_process(self) -> multiprocessing.Process:
        return multiprocessing.Process(target=_update_local_db_command)

    def _get_process(self) -> multiprocessing.Process:
        if self._process.exitcode is not None:
            self._process = self._get_new_process()
        return self._process

    def start_process(self) -> UpdateProcessStatus:
        if not self._process.is_alive():
            self._get_process().start()

        return self.get_process_status()

    def get_process_status(self) -> UpdateProcessStatus:
        if self._process.is_alive():
            return UpdateProcessStatus(status="running")
        else:
            return UpdateProcessStatus(status="finished")


process_manager = ProcessManager()


def start_update_local_db():
    """
    Start update local db
    """
    return process_manager.start_process()


def status_update_local_db():
    """
    Status update local db
    """
    return process_manager.get_process_status()
