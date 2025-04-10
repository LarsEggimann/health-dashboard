from fastapi import APIRouter, Depends
from typing import Optional, Annotated
from datetime import datetime

from app.deps import reusable_oauth2
from app.core.garmin.garmin_db import MonitoringSessionDep
from app.models.garmin import MonitoringHeartRates
from app.core.garmin import garmin_crud
from app.core.garmin import garmin_service
from app.models.garmin import UpdateProcessStatus


router = APIRouter(dependencies=[Depends(reusable_oauth2)], tags=["health-data"])


async def time_frame_input(
    start: Optional[datetime] = None, end: Optional[datetime] = None
):
    """
    Time frame input
    """
    return {"start": start, "end": end}


TimeFrameInputDep = Annotated[dict, Depends(time_frame_input)]


@router.post("/health-data/update")
def update_health_data():
    """
    Update health data
    """
    garmin_service.start_update_local_db()
    return {"msg": "ok"}


@router.get("/health-data/update/status", response_model=UpdateProcessStatus)
def get_status_on_update_health_data():
    """
    Get status on update health data
    """
    return garmin_service.status_update_local_db()


@router.get("/health-data/monitoring/heart-rate", response_model=MonitoringHeartRates)
def get_monitoring_heart_rate(
    time_frame: TimeFrameInputDep, monitoring_session: MonitoringSessionDep
):
    """
    Get monitoring heart rate
    """
    data = garmin_crud.get_monitoring_heart_rate(
        session=monitoring_session, start=time_frame["start"], end=time_frame["end"]
    )

    return data
