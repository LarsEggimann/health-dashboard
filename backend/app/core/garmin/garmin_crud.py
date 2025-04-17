from sqlmodel import Session, select, asc
from app.models.garmin_monitoring import (
    MonitoringHeartRateResponse,
    Monitoring,
    MonitoringResponse,
    MonitoringHeartRate,
)
from app.models.common import TimeFrameInput


def get_monitoring_heart_rate(
    *, session: Session, time_frame: TimeFrameInput
) -> MonitoringHeartRateResponse | None:
    """
    Get monitoring heart rate
    """
    statement = select(MonitoringHeartRate.timestamp, MonitoringHeartRate.heart_rate)

    if time_frame.start:
        statement = statement.where(MonitoringHeartRate.timestamp >= time_frame.start)
    if time_frame.end:
        statement = statement.where(MonitoringHeartRate.timestamp <= time_frame.end)

    # sort by timestamp ascending
    statement = statement.order_by(asc(MonitoringHeartRate.timestamp))

    session_hr = session.exec(statement).all()

    timestamps, heart_rates = zip(*session_hr) if session_hr else ([], [])

    return MonitoringHeartRateResponse(
        heart_rate=list(heart_rates),
        timestamp=list(timestamps),
    )


def get_monitoring_data(
    *, session: Session, time_frame: TimeFrameInput
) -> MonitoringResponse:
    """
    Get monitoring data
    """
    statement = select(Monitoring)

    if time_frame.start:
        statement = statement.where(Monitoring.timestamp >= time_frame.start)
    if time_frame.end:
        statement = statement.where(Monitoring.timestamp <= time_frame.end)

    # sort by timestamp ascending
    statement = statement.order_by(asc(Monitoring.timestamp))

    session_hr = session.exec(statement).all()

    return MonitoringResponse(
        data=list(session_hr),
    )
