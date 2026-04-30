from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_user
from app.core.exceptions import LegalAIException
from app.models.user import User
from app.schemas.immigration import (
    ChecklistItem,
    CRSInput,
    CRSResult,
    EEDrawResponse,
    ImmigrationProgramResponse,
    PathwayMatchResponse,
)
from app.services import immigration_service

router = APIRouter()


@router.post("/crs/calculate", response_model=CRSResult)
async def calculate_crs(input_data: CRSInput):
    """Calculate a Comprehensive Ranking System (CRS) score.

    No authentication required. Accepts a CRS profile and returns the total
    score together with a section-by-section breakdown.
    """
    try:
        return immigration_service.calculate_crs(input_data)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.get("/programs", response_model=list[ImmigrationProgramResponse])
async def list_programs(session: AsyncSession = Depends(get_session)):
    """List all active immigration programs.

    No authentication required.
    """
    try:
        return await immigration_service.get_programs(session)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.post("/pathways/match", response_model=list[PathwayMatchResponse])
async def match_pathways(
    input_data: CRSInput,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Match a candidate profile against active immigration programs.

    Requires authentication. Calculates the CRS score and evaluates
    eligibility for each program.
    """
    try:
        return await immigration_service.match_pathways(session, input_data)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.get("/checklist", response_model=list[ChecklistItem])
async def get_checklist():
    """Return the standard post-landing checklist.

    No authentication required.
    """
    try:
        return immigration_service.get_checklist()
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.get("/draws", response_model=list[EEDrawResponse])
async def get_draws(session: AsyncSession = Depends(get_session)):
    """Return recent Express Entry draws, newest first.

    No authentication required.
    """
    try:
        return await immigration_service.get_draws(session)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )
