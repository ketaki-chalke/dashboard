# db/schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Pydantic model for the Alert response (used in API responses)
class AlertOut(BaseModel):
    id: int
    server_id: int
    message: str
    severity: str
    timestamp: datetime

    class Config:
        from_attributes = True # Tells Pydantic to work with SQLAlchemy models


# Pydantic model for the Server response (used in API responses)
class ServerOut(BaseModel):
    id: int
    name: str
    ip_address: str
    location: Optional[str]  # Allow None as a valid value
    tag: Optional[str]
    provider: Optional[str]


    class Config:
        from_attributes = True  # orm_mode is deprecated in Pydantic v2



# Pydantic model for UsageStat response (used in API responses)
class UsageStatOut(BaseModel):
    id: int
    server_id: int
    ram_usage: float
    cpu_usage: float
    timestamp: datetime

    class Config:
        from_attributes = True # Tells Pydantic to work with SQLAlchemy models
