import uuid
from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin, TimestampMixin


class ImmigrationProgram(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "immigration_programs"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    province: Mapped[str] = mapped_column(String(50), nullable=False)
    program_type: Mapped[str] = mapped_column(String(100), nullable=False)
    min_crs_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    requirements: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class EEDraw(UUIDMixin, Base):
    __tablename__ = "ee_draws"

    draw_number: Mapped[int] = mapped_column(Integer, nullable=False)
    draw_date: Mapped[date] = mapped_column(Date, nullable=False)
    min_score: Mapped[int] = mapped_column(Integer, nullable=False)
    invitations: Mapped[int] = mapped_column(Integer, nullable=False)
    program_type: Mapped[str] = mapped_column(String(100), nullable=False)


class ImmigrationProfile(UUIDMixin, Base):
    __tablename__ = "immigration_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    profile_data: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    crs_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime, onupdate=func.now(), nullable=True
    )
