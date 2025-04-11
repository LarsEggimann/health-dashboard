from fastapi import APIRouter, Depends

from app.deps import reusable_oauth2
from app.core.garmin.garmin_db import MonitoringSessionDep
from app.models.garmin import MonitoringHeartRates
from app.core.garmin import garmin_crud

router = APIRouter(dependencies=[Depends(reusable_oauth2)], tags=["health-data"])


@router.post("/health-data/update")
def update_health_data():
    """
    Update health data
    """
    return {"msg": "ok"}


@router.get("/health-data/monitoring/heart-rate", response_model=MonitoringHeartRates)
def get_monitoring_heart_rate(monitoring_session: MonitoringSessionDep):
    """
    Get monitoring heart rate
    """
    data = garmin_crud.get_monitoring_heart_rate(session=monitoring_session)

    return data
    