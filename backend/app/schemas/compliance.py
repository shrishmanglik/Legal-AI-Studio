from datetime import date
from uuid import UUID

from pydantic import BaseModel


class EmploymentStandardResponse(BaseModel):
    id: UUID
    province: str
    topic: str
    rule_text: str
    effective_date: date | None
    source_url: str | None

    class Config:
        from_attributes = True


class ComplianceRuleResponse(BaseModel):
    id: UUID
    jurisdiction: str
    category: str
    rule_name: str
    description: str
    checklist_items: dict

    class Config:
        from_attributes = True


class ComplianceChecklistResponse(BaseModel):
    jurisdiction: str
    category: str
    items: list[dict]
