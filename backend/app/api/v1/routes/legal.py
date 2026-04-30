from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_user
from app.core.exceptions import LegalAIException
from app.models.user import User
from app.schemas.legal import (
    LegalQAHistoryItem,
    LegalQARequest,
    LegalQAResponse,
)
from app.services import legal_service

router = APIRouter()


@router.post("/qa", response_model=LegalQAResponse)
async def ask_legal_question(
    body: LegalQARequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Submit a legal question and receive an AI-generated answer.

    Requires authentication. Answers are cached for 7 days so repeated
    identical questions return faster.
    """
    try:
        return await legal_service.answer_question(
            session, body.question, body.jurisdiction, current_user.id
        )
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.get("/qa/history", response_model=list[LegalQAHistoryItem])
async def get_qa_history(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Return the Q&A history for the authenticated user.

    Most recent entries are returned first.
    """
    try:
        return await legal_service.get_history(session, current_user.id)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )
