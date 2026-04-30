from datetime import date

from sqlalchemy import Date, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin
from app.models.types import jsonb_column


class EmploymentStandard(UUIDMixin, Base):
    __tablename__ = "employment_standards"

    province: Mapped[str] = mapped_column(String(50), nullable=False)
    topic: Mapped[str] = mapped_column(String(200), nullable=False)
    rule_text: Mapped[str] = mapped_column(Text, nullable=False)
    effective_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    source_url: Mapped[str | None] = mapped_column(Text, nullable=True)


class ComplianceRule(UUIDMixin, Base):
    __tablename__ = "compliance_rules"

    jurisdiction: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(String(200), nullable=False)
    rule_name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    checklist_items: Mapped[dict] = mapped_column(jsonb_column(), nullable=False, default=dict)
