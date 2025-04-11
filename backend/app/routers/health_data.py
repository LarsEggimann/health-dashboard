from fastapi import APIRouter, Depends


from app.deps import reusable_oauth2
from app.core.garmin.garmin_db import MonitoringSessionDep
from app.models.garmin import MonitoringHeartRates, MonitoringHeartRates2
from app.core.garmin import garmin_crud
from app.deps import TimeFrameInputDep

router = APIRouter(
    dependencies=[Depends(reusable_oauth2)], tags=["health-data"], prefix="/health-data"
)


@router.get("/monitoring/heart-rate", response_model=MonitoringHeartRates)
def get_monitoring_heart_rate(
    monitoring_session: MonitoringSessionDep, time_frame: TimeFrameInputDep
):
    """
    Get monitoring heart rate based on optional time frame input.
    """
    data = garmin_crud.get_monitoring_heart_rate(
        session=monitoring_session, time_frame=time_frame
    )

    return data

@router.get("/monitoring/heart-rate-2", response_model=MonitoringHeartRates2)
def get_monitoring_heart_rate2(
    monitoring_session: MonitoringSessionDep, time_frame: TimeFrameInputDep
):
    """
    Get monitoring heart rate based on optional time frame input.
    """
    data = garmin_crud.get_monitoring_heart_rate2(
        session=monitoring_session, time_frame=time_frame
    )

    return data
