from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class LegalQARequest(BaseModel):
    question: str
    jurisdiction: str = "federal"


class LegalQAResponse(BaseModel):
    question: str
    answer: str
    jurisdiction: str
    sources: list[str]
    cached: bool


class LegalQAHistoryItem(BaseModel):
    id: UUID
    question: str
    answer: str
    jurisdiction: str
    created_at: datetime

    class Config:
        from_attributes = True
