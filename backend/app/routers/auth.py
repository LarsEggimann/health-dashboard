from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from deps import SessionDep  # pylint: disable=import-error
from models.token import Token  # pylint: disable=import-error
from models.user import User  # pylint: disable=import-error
from core import crud  # pylint: disable=import-error
from core.config import settings  # pylint: disable=import-error
from core.security import create_access_token  # pylint: disable=import-error

router = APIRouter(tags=["auth"])


@router.post("/login/access-token")
async def login_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep
) -> Token:
    """
    OAuth2 compatible token login, get an access token for requests
    """
    user: User = crud.authenticate(
        session=session, username=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=create_access_token(
            user.username, expires_delta=access_token_expires
        )
    )
