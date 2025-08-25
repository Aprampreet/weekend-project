from ninja import Schema
from typing import Optional
from datetime import datetime

class ProfileOut(Schema):
    username: str
    email: str
    full_name: Optional[str] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    mobile: Optional[str] = None
    profile_pic: Optional[str] = None
    created_at: Optional[datetime] = None

class ProfileUpdateIn(Schema):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    mobile: Optional[str] = None
