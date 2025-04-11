from fastapi import APIRouter, Depends


from app.deps import reusable_oauth2
from app.core.garmin import garmin_service
from app.models.garmin import UpdateProcessStatus

router = APIRouter(
    dependencies=[Depends(reusable_oauth2)],
    tags=["health-data-management"],
    prefix="/health-data-management",
)


@router.post("/update", response_model=UpdateProcessStatus)
def update_health_data():
    """
    Update health data, starts separete process to update server db for corresponding user
    """
    return garmin_service.start_update_local_db()


@router.get("/update/status", response_model=UpdateProcessStatus)
def get_status_on_update_health_data():
    """
    Get status on update health data process
    """
    return garmin_service.status_update_local_db()
