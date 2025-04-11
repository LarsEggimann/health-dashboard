import os
import multiprocessing

from app.models.garmin import UpdateProcessStatus


def _update_local_db_process():
    """
    Update local db
    """
    os.system("garmindb_cli.py --all --download --import --analyze --latest")

_update_process = multiprocessing.Process(target=_update_local_db_process)

def start_update_local_db():
    """
    Start update local db
    """
    _update_process.start()

def status_update_local_db():
    """
    Status update local db
    """
    if _update_process.is_alive():
        return UpdateProcessStatus(status="running")
    else:
        return UpdateProcessStatus(status="finished")
