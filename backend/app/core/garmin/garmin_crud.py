

from sqlmodel import Session, select
from typing import Literal, Optional, Annotated
from datetime import datetime
from app.models.garmin import MonitoringHeartRate, MonitoringHeartRates

def get_monitoring_heart_rate(*, session: Session, start: Optional[datetime] = None, end: Optional[datetime] = None) -> MonitoringHeartRates | None:
    """
    Get monitoring heart rate
    """
    statement = select(MonitoringHeartRate.timestamp, MonitoringHeartRate.heart_rate)

    if start:
        statement = statement.where(MonitoringHeartRate.timestamp >= start)
    if end:
        statement = statement.where(MonitoringHeartRate.timestamp <= end)

    session_hr = session.exec(statement).all()

    timestamps, heart_rates = zip(*session_hr) if session_hr else ([], [])

    return MonitoringHeartRates(
        heart_rate=list(heart_rates),
        timestamp=list(timestamps),
    )
