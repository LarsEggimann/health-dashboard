from typing import Annotated
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from sqlmodel import Session
from typing import Optional
from datetime import datetime

from app.core.config import settings
from app.core.db import get_session
from app.core.crud import get_user_by_username
from app.models.token import TokenData
from app.models.user import User
from app.models.common import TimeFrameInput


reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)

SessionDep = Annotated[Session, Depends(get_session)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]


async def get_current_user(token: TokenDep, session: SessionDep) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError as exc:
        raise credentials_exception from exc

    user = get_user_by_username(session=session, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


CurrentActiveUserDep = Annotated[User, Depends(get_current_active_user)]


async def get_current_active_superuser(current_user: CurrentActiveUserDep) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user


async def time_frame_input(
    start: Optional[datetime] = None, end: Optional[datetime] = None
) -> TimeFrameInput:
    return TimeFrameInput(
        start=start,
        end=end,
    )


TimeFrameInputDep = Annotated[TimeFrameInput, Depends(time_frame_input)]
