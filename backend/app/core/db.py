from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings
from app.models.user import User
from app.models.current_data import CurrentData


connect_args = {"check_same_thread": False}
engine = create_engine(settings.SQLITE_URL, connect_args=connect_args)


def get_session():
    with Session(engine) as session:
        yield session


def init_db() -> None:
    SQLModel.metadata.create_all(engine, tables=[User.__table__, CurrentData.__table__])
