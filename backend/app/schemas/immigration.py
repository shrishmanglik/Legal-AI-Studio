from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Language helpers
# ---------------------------------------------------------------------------

class LanguageScores(BaseModel):
    speaking: int = Field(..., ge=0, le=12)
    listening: int = Field(..., ge=0, le=12)
    reading: int = Field(..., ge=0, le=12)
    writing: int = Field(..., ge=0, le=12)


# ---------------------------------------------------------------------------
# CRS calculator schemas
# ---------------------------------------------------------------------------

class CRSInput(BaseModel):
    age: int
    has_spouse: bool = False
    education_level: str
    first_language: LanguageScores
    second_language: LanguageScores | None = None
    canadian_work_experience_years: int = 0
    foreign_work_experience_years: int = 0
    spouse_education_level: str | None = None
    spouse_language: LanguageScores | None = None
    spouse_canadian_work_years: int = 0
    has_certificate_of_qualification: bool = False
    has_provincial_nomination: bool = False
    job_offer_noc_level: str | None = Field(
        default=None,
        description="NOC level of arranged employment: '00', '0ab', 'other', or None",
    )
    canadian_education_years: int = 0
    has_sibling_in_canada: bool = False
    french_clb7_plus: bool = False
    english_clb5_plus: bool = True


class CRSBreakdown(BaseModel):
    core_human_capital: int
    spouse_factors: int
    skill_transferability: int
    additional_points: int


class CRSResult(BaseModel):
    total_score: int
    breakdown: CRSBreakdown
    max_score: int = 1200


# ---------------------------------------------------------------------------
# Immigration program / pathway schemas
# ---------------------------------------------------------------------------

class ImmigrationProgramResponse(BaseModel):
    id: UUID
    name: str
    province: str
    program_type: str
    min_crs_score: int | None
    requirements: dict
    active: bool

    class Config:
        from_attributes = True


class PathwayMatchResponse(BaseModel):
    program: ImmigrationProgramResponse
    eligible: bool
    match_score: float
    notes: list[str]


# ---------------------------------------------------------------------------
# Post-landing checklist
# ---------------------------------------------------------------------------

class ChecklistItem(BaseModel):
    id: str
    title: str
    description: str
    category: str
    order: int
    is_completed: bool = False


# ---------------------------------------------------------------------------
# Express Entry draw
# ---------------------------------------------------------------------------

class EEDrawResponse(BaseModel):
    id: UUID
    draw_number: int
    draw_date: date
    min_score: int
    invitations: int
    program_type: str

    class Config:
        from_attributes = True
