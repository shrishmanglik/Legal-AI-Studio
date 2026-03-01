"""
Compliance service — query employment standards and build
compliance checklists by jurisdiction and category.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.compliance import ComplianceRule, EmploymentStandard
from app.schemas.compliance import (
    ComplianceChecklistResponse,
    ComplianceRuleResponse,
    EmploymentStandardResponse,
)


async def get_employment_standards(
    session: AsyncSession, province: str
) -> list[EmploymentStandardResponse]:
    """Return employment standards for a given province."""
    result = await session.execute(
        select(EmploymentStandard).where(EmploymentStandard.province == province)
    )
    standards = result.scalars().all()
    return [EmploymentStandardResponse.model_validate(s) for s in standards]


async def get_compliance_checklist(
    session: AsyncSession, jurisdiction: str, category: str
) -> ComplianceChecklistResponse:
    """Query ComplianceRule entries and return a structured checklist."""
    query = select(ComplianceRule).where(
        ComplianceRule.jurisdiction == jurisdiction,
        ComplianceRule.category == category,
    )
    result = await session.execute(query)
    rules = result.scalars().all()

    items: list[dict] = []
    for rule in rules:
        rule_resp = ComplianceRuleResponse.model_validate(rule)
        checklist_entries = rule.checklist_items
        if isinstance(checklist_entries, list):
            for entry in checklist_entries:
                items.append(entry)
        elif isinstance(checklist_entries, dict):
            # Single-item or keyed format — include the whole dict
            items.append(
                {
                    "rule_name": rule_resp.rule_name,
                    "description": rule_resp.description,
                    **checklist_entries,
                }
            )

    return ComplianceChecklistResponse(
        jurisdiction=jurisdiction,
        category=category,
        items=items,
    )
