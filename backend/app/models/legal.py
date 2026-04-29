from datetime import datetime

from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin
from app.models.types import jsonb_column


class Statute(UUIDMixin, Base):
    __tablename__ = "statutes"

    jurisdiction: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    section: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(200), nullable=False)


class LegalAICache(UUIDMixin, Base):
    __tablename__ = "legal_ai_cache"

    query_hash: Mapped[str] = mapped_column(
        String(64), unique=True, index=True, nullable=False
    )
    query_text: Mapped[str] = mapped_column(Text, nullable=False)
    response_text: Mapped[str] = mapped_column(Text, nullable=False)
    statute_ids: Mapped[dict | None] = mapped_column(jsonb_column(), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
