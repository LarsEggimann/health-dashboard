from sqlmodel import Session, select, asc
from app.models.garmin import MonitoringHeartRate, MonitoringHeartRates
from app.models.common import TimeFrameInput


def get_monitoring_heart_rate(
    *, session: Session, time_frame: TimeFrameInput
) -> MonitoringHeartRates | None:
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

    return MonitoringHeartRates(
        heart_rate=list(heart_rates),
        timestamp=list(timestamps),
    )
