"""
Document generation service — list templates, render with Jinja2,
and persist user documents.
"""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException, ValidationException
from app.models.documents import DocumentTemplate, UserDocument
from app.schemas.documents import (
    DocumentGenerateResponse,
    DocumentTemplateResponse,
)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

async def list_templates(session: AsyncSession) -> list[DocumentTemplateResponse]:
    """Return all document templates."""
    result = await session.execute(select(DocumentTemplate))
    templates = result.scalars().all()
    return [DocumentTemplateResponse.model_validate(t) for t in templates]


async def get_template(
    session: AsyncSession, template_id: UUID
) -> DocumentTemplateResponse:
    """Fetch a single template by ID."""
    result = await session.execute(
        select(DocumentTemplate).where(DocumentTemplate.id == template_id)
    )
    template = result.scalar_one_or_none()
    if template is None:
        raise NotFoundException("Document template not found")
    return DocumentTemplateResponse.model_validate(template)


async def generate_document(
    session: AsyncSession,
    template_id: UUID,
    variables: dict,
    user_id: UUID,
) -> DocumentGenerateResponse:
    """Load template, render with provided variables, and persist as a UserDocument."""
    result = await session.execute(
        select(DocumentTemplate).where(DocumentTemplate.id == template_id)
    )
    template = result.scalar_one_or_none()
    if template is None:
        raise NotFoundException("Document template not found")

    try:
        rendered = _render_template(template.template_content, variables)
    except Exception as exc:
        raise ValidationException(f"Template rendering failed: {exc}")

    doc = UserDocument(
        user_id=user_id,
        template_id=template.id,
        title=template.name,
        content=rendered,
    )
    session.add(doc)
    await session.commit()
    await session.refresh(doc)

    return DocumentGenerateResponse(
        id=doc.id,
        title=doc.title,
        content=doc.content,
        file_url=doc.file_url,
    )


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _render_template(template_content: str, variables: dict) -> str:
    """Render a Jinja2 template string with the supplied variables."""
    from jinja2 import BaseLoader, Environment, TemplateSyntaxError, UndefinedError

    env = Environment(loader=BaseLoader(), autoescape=False)

    try:
        tmpl = env.from_string(template_content)
    except TemplateSyntaxError as exc:
        raise ValidationException(f"Invalid template syntax: {exc}")

    try:
        return tmpl.render(**variables)
    except UndefinedError as exc:
        raise ValidationException(f"Missing template variable: {exc}")
