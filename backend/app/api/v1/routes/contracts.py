from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_user
from app.core.exceptions import LegalAIException
from app.models.user import User
from app.schemas.contracts import (
    ClauseLibraryResponse,
    ContractReviewResponse,
    ContractUploadResponse,
)
from app.services import contract_service

router = APIRouter()
clauses_router = APIRouter()


# ---------------------------------------------------------------------------
# Contract review endpoints (auth required, mounted at /contracts)
# ---------------------------------------------------------------------------


@router.post("/upload", response_model=ContractUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_contract(
    file: UploadFile,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Upload a contract file (PDF, DOCX, or TXT) for automated review.

    The service extracts text, detects standard clauses, identifies missing
    clauses, and calculates a risk score.
    """
    try:
        return await contract_service.upload_and_review(session, file, current_user.id)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.get("/", response_model=list[ContractReviewResponse])
async def list_reviews(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """List all contract reviews for the authenticated user, newest first."""
    try:
        return await contract_service.list_reviews(session, current_user.id)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.get("/{review_id}", response_model=ContractReviewResponse)
async def get_review(
    review_id: UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Retrieve a single contract review by ID.

    Only returns reviews belonging to the authenticated user.
    """
    try:
        return await contract_service.get_review(session, review_id, current_user.id)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


# ---------------------------------------------------------------------------
# Clause library endpoint (no auth, mounted at /clauses via clauses_router)
# ---------------------------------------------------------------------------


@clauses_router.get("/clauses", response_model=list[ClauseLibraryResponse])
async def list_clauses(session: AsyncSession = Depends(get_session)):
    """Return all entries in the clause library.

    No authentication required.
    """
    try:
        return await contract_service.get_clause_library(session)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )
