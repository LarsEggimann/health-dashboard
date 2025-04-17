from datetime import datetime, time
from typing import Literal
from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class UpdateProcessStatus(BaseModel):
    status: Literal["running", "finished"]


class MonitoringHeartRate(SQLModel, table=True):
    __tablename__ = "monitoring_hr"
    timestamp: datetime = Field(primary_key=True)
    heart_rate: int


class MonitoringHeartRateResponse(BaseModel):
    heart_rate: list[int]
    timestamp: list[datetime]


class Monitoring(SQLModel, table=True):
    __tablename__ = "monitoring"
    timestamp: datetime = Field(primary_key=True)
    activity_type: str
    intensity: int
    duration: time
    distance: float
    cum_active_time: time
    active_calories: int
    steps: int
    strokes: int
    cycles: float


class MonitoringResponse(BaseModel):
    data: list[Monitoring]
