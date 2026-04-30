import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from app.models.types import uuid_column


class Base(DeclarativeBase):
    pass


class UUIDMixin:
    id: Mapped[uuid.UUID] = mapped_column(
        uuid_column(), primary_key=True, default=uuid.uuid4
    )


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime, onupdate=func.now(), nullable=True
    )
