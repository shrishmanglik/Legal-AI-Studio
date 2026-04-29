import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin
from app.models.types import jsonb_column, uuid_column


class DocumentTemplate(UUIDMixin, Base):
    __tablename__ = "document_templates"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    template_content: Mapped[str] = mapped_column(Text, nullable=False)
    jurisdiction: Mapped[str] = mapped_column(String(100), nullable=False)
    variables_schema: Mapped[dict] = mapped_column(jsonb_column(), nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )


class UserDocument(UUIDMixin, Base):
    __tablename__ = "user_documents"

    user_id: Mapped[uuid.UUID] = mapped_column(
        uuid_column(), ForeignKey("users.id"), nullable=False
    )
    template_id: Mapped[uuid.UUID | None] = mapped_column(
        uuid_column(), ForeignKey("document_templates.id"), nullable=True
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    file_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )
