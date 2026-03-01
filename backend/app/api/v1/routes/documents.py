from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_user
from app.core.exceptions import LegalAIException
from app.models.user import User
from app.schemas.documents import (
    DocumentGenerateRequest,
    DocumentGenerateResponse,
    DocumentTemplateResponse,
)
from app.services import document_service

router = APIRouter()


@router.get("/templates", response_model=list[DocumentTemplateResponse])
async def list_templates(session: AsyncSession = Depends(get_session)):
    """List all available document templates.

    No authentication required.
    """
    try:
        return await document_service.list_templates(session)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.get("/templates/{template_id}", response_model=DocumentTemplateResponse)
async def get_template(
    template_id: UUID,
    session: AsyncSession = Depends(get_session),
):
    """Retrieve a single document template by ID.

    No authentication required.
    """
    try:
        return await document_service.get_template(session, template_id)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.post("/generate", response_model=DocumentGenerateResponse, status_code=status.HTTP_201_CREATED)
async def generate_document(
    body: DocumentGenerateRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Generate a document from a template with provided variables.

    Requires authentication. The generated document is persisted and
    associated with the authenticated user.
    """
    try:
        return await document_service.generate_document(
            session, body.template_id, body.variables, current_user.id
        )
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )
