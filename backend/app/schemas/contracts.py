from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ContractUploadResponse(BaseModel):
    id: UUID
    filename: str
    status: str


class ClauseFound(BaseModel):
    clause_type: str
    name: str
    confidence: float
    text_excerpt: str


class ContractReviewResponse(BaseModel):
    id: UUID
    filename: str
    status: str
    risk_score: float | None
    summary: str | None
    clauses_found: list[ClauseFound]
    missing_clauses: list[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ClauseLibraryResponse(BaseModel):
    id: UUID
    clause_type: str
    name: str
    description: str
    risk_level: str
    example_text: str

    class Config:
        from_attributes = True
