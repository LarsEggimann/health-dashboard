from typing import Literal, Optional
from pydantic import BaseModel
from sqlmodel import Field, SQLModel
from datetime import datetime
from fastapi import Query

class UpdateProcessStatus(BaseModel):
    status: Literal["running", "finished"]

class MonitoringHeartRate(SQLModel, table=True):
    __tablename__ = "monitoring_hr"
    timestamp: datetime = Field(primary_key=True)
    heart_rate: int

class MonitoringHeartRates(BaseModel):
    heart_rate: list[int]
    timestamp: list[datetime]


class MonitoringHeartRateInput(BaseModel):
    start: Optional[datetime] = None
    end: Optional[datetime] = None
