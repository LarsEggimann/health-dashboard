from typing import Any

from fastapi import APIRouter, Depends

from app.deps import reusable_oauth2, CurrentActiveUserDep
from app.models.user import UserPublic

router = APIRouter(dependencies=[Depends(reusable_oauth2)], tags=["users"])


@router.get("/user/me", response_model=UserPublic)
def get_own_user(user: CurrentActiveUserDep) -> Any:
    """
    get own user
    """
    return user
