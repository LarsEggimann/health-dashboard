import secrets
import warnings
from typing import Annotated, Any, Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Settings for the application."""

    # Application settings
    PROJECT_NAME: str = "FastAPI Template"
    API_V1_STR: str = "/api/v1"

    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 1  # 1 day

    # CORS settings
    CORS_ORIGINS: list[str] | str | None = None
    


settings = Settings()  # type: ignore
