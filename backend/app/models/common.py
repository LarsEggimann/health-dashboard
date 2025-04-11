from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TimeFrameInput(BaseModel):
    start: Optional[datetime] = None
    end: Optional[datetime] = None
