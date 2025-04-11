import os
from sqlmodel import Session, create_engine
from sqlalchemy import Engine
from typing import Annotated
from fastapi import Depends

from app.deps import CurrentActiveUserDep

connect_args = {"check_same_thread": False}


def _get_db_base_path(username: str) -> str:
    return f"sqlite:///{os.path.join(os.path.dirname(__file__))}/data/{username}/DBs"


def create_engine_for_username(username: str) -> Engine:
    """
    Create a new engine for the given username.
    """
    return create_engine(
        f"{_get_db_base_path(username)}/garmin_monitoring.db",
        connect_args=connect_args,
    )


class Engines:
    monitoring_engines: dict[str, Engine] = {}


enignes = Engines()


def get_monitoring_session(user: CurrentActiveUserDep):
    username = user.username
    if username not in enignes.monitoring_engines:
        monitoring_engine = create_engine_for_username(username)
        enignes.monitoring_engines[username] = monitoring_engine
    else:
        monitoring_engine = enignes.monitoring_engines[username]
    with Session(monitoring_engine) as session:
        yield session


MonitoringSessionDep = Annotated[Session, Depends(get_monitoring_session)]
