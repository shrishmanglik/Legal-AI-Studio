from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class BaseResponse(BaseModel):
    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int
    per_page: int


class MessageResponse(BaseModel):
    message: str
