from datetime import datetime
from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class CurrentData(SQLModel, table=True):
    __tablename__ = "em_current_data"
    time: float = Field(primary_key=True, index=True)
    current: float = Field(default=0.0, le=1e35)


class CurrentDataResponse(BaseModel):
    current: list[float]
    time: list[datetime]
