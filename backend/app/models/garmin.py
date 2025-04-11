from typing import Literal
from pydantic import BaseModel
from sqlmodel import Field, SQLModel
from datetime import datetime

class ReadOnlyModel(SQLModel):
    class Config:
        arbitrary_types_allowed = True
        orm_mode = True

class UpdateProcessStatus(BaseModel):
    status: Literal["running", "finished"]

class MonitoringHeartRate(ReadOnlyModel, table=True):
    __tablename__ = "monitoring_hr"
    timestamp: datetime = Field(primary_key=True)
    heart_rate: int

class MonitoringHeartRates(ReadOnlyModel):
    heart_rate: list[int]
    timestamp: list[datetime]
