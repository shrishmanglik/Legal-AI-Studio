from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.exceptions import LegalAIException
from app.schemas.compliance import (
    ComplianceChecklistResponse,
    EmploymentStandardResponse,
)
from app.services import compliance_service

router = APIRouter()


@router.get("/standards", response_model=list[EmploymentStandardResponse])
async def get_employment_standards(
    province: str = Query(..., description="Two-letter province code, e.g. 'ON'"),
    session: AsyncSession = Depends(get_session),
):
    """Return employment standards for the specified province.

    No authentication required.
    """
    try:
        return await compliance_service.get_employment_standards(session, province)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.get("/checklist", response_model=ComplianceChecklistResponse)
async def get_compliance_checklist(
    jurisdiction: str = Query(..., description="Jurisdiction identifier, e.g. 'ON' or 'federal'"),
    category: str = Query(..., description="Compliance category, e.g. 'employment' or 'privacy'"),
    session: AsyncSession = Depends(get_session),
):
    """Return a compliance checklist for the given jurisdiction and category.

    No authentication required.
    """
    try:
        return await compliance_service.get_compliance_checklist(
            session, jurisdiction, category
        )
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )
