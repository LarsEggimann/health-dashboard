import os
from sqlmodel import Session, create_engine
from typing import Annotated
from fastapi import Depends

from app.deps import CurrentActiveUser


def create_engine_for_username(username: str):
    """
    Create a new engine for the given username.
    """
    return create_engine(
        f"sqlite:///{os.path.join(os.path.dirname(__file__))}/data/{username}/DBs/garmin_monitoring.db",
        connect_args={"check_same_thread": False},
    )


class Engines:
    monitoring_engines = dict()


enignes = Engines()


def get_monitoring_session(user: CurrentActiveUser):
    username = user.username
    if username not in enignes.monitoring_engines:
        monitoring_engine = create_engine_for_username(username)
        enignes.monitoring_engines[username] = monitoring_engine
    else:
        monitoring_engine = enignes.monitoring_engines[username]
    with Session(monitoring_engine) as session:
        yield session


MonitoringSessionDep = Annotated[Session, Depends(get_monitoring_session)]
