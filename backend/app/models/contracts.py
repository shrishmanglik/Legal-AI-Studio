import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin, TimestampMixin
from app.models.types import jsonb_column, uuid_column


class ClauseLibrary(UUIDMixin, Base):
    __tablename__ = "clause_library"

    clause_type: Mapped[str] = mapped_column(String(100), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    risk_level: Mapped[str] = mapped_column(String(50), nullable=False)
    example_text: Mapped[str] = mapped_column(Text, nullable=False)


class ContractReview(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "contract_reviews"

    user_id: Mapped[uuid.UUID] = mapped_column(
        uuid_column(), ForeignKey("users.id"), nullable=False
    )
    filename: Mapped[str] = mapped_column(String(500), nullable=False)
    file_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False)
    risk_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    clauses_found: Mapped[dict | None] = mapped_column(jsonb_column(), nullable=True)
    missing_clauses: Mapped[dict | None] = mapped_column(jsonb_column(), nullable=True)
