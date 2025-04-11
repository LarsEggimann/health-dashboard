

from sqlmodel import Session, select

from app.models.garmin import MonitoringHeartRate, MonitoringHeartRates


def get_monitoring_heart_rate(*, session: Session) -> MonitoringHeartRates | None:
    """
    Get monitoring heart rate
    """
    statement = select(MonitoringHeartRate.timestamp, MonitoringHeartRate.heart_rate)
    session_hr = session.exec(statement).all()

    timestamps, heart_rates = zip(*session_hr) if session_hr else ([], [])

    return MonitoringHeartRates(
        heart_rate=list(heart_rates),
        timestamp=list(timestamps),
    )
