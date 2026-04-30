"""
Immigration service — orchestrates CRS calculation, program matching,
checklists, and Express Entry draw queries.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.immigration import EEDraw, ImmigrationProgram
from app.schemas.immigration import (
    CRSInput,
    CRSResult,
    ChecklistItem,
    EEDrawResponse,
    ImmigrationProgramResponse,
    PathwayMatchResponse,
)
from app.services.crs_calculator import CRSCalculator
from app.services.pnp_matcher import PNPMatcher


# ---------------------------------------------------------------------------
# Standard post-landing checklist
# ---------------------------------------------------------------------------

_POST_LANDING_CHECKLIST: list[dict] = [
    {
        "id": "sin",
        "title": "Apply for a Social Insurance Number (SIN)",
        "description": "Visit a Service Canada office with your landing documents to obtain your SIN.",
        "category": "Essentials",
        "order": 1,
    },
    {
        "id": "health_card",
        "title": "Register for Provincial Health Insurance",
        "description": "Apply for your provincial health card. There may be a waiting period of up to 3 months.",
        "category": "Health",
        "order": 2,
    },
    {
        "id": "bank_account",
        "title": "Open a Canadian Bank Account",
        "description": "Bring your PR card or COPR and two pieces of ID to open a bank account.",
        "category": "Finance",
        "order": 3,
    },
    {
        "id": "pr_card",
        "title": "Receive Permanent Resident Card",
        "description": "Your PR card will be mailed to your Canadian address. Ensure IRCC has your correct address.",
        "category": "Essentials",
        "order": 4,
    },
    {
        "id": "tax_filing",
        "title": "Understand Tax Obligations",
        "description": "Register with the CRA and learn about filing requirements for your first tax year.",
        "category": "Finance",
        "order": 5,
    },
    {
        "id": "drivers_license",
        "title": "Obtain a Driver's License",
        "description": "Exchange or apply for a provincial driver's license. Rules vary by province.",
        "category": "Transportation",
        "order": 6,
    },
    {
        "id": "credential_assessment",
        "title": "Get Foreign Credentials Assessed",
        "description": "Contact the relevant regulatory body in your province to assess and recognise your credentials.",
        "category": "Employment",
        "order": 7,
    },
    {
        "id": "language_classes",
        "title": "Enrol in Free Language Classes",
        "description": "LINC (English) and CLIC (French) classes are free for permanent residents.",
        "category": "Settlement",
        "order": 8,
    },
    {
        "id": "settlement_services",
        "title": "Connect with Settlement Services",
        "description": "Find free newcomer services near you at IRCC's list of funded organizations.",
        "category": "Settlement",
        "order": 9,
    },
    {
        "id": "citizenship_track",
        "title": "Start Tracking Days for Citizenship",
        "description": "You need 1,095 days of physical presence in 5 years. Start tracking from your landing date.",
        "category": "Long-term",
        "order": 10,
    },
]


# ---------------------------------------------------------------------------
# Service functions
# ---------------------------------------------------------------------------

async def get_programs(session: AsyncSession) -> list[ImmigrationProgramResponse]:
    """Return all active immigration programs."""
    result = await session.execute(
        select(ImmigrationProgram).where(ImmigrationProgram.active.is_(True))
    )
    programs = result.scalars().all()
    return [ImmigrationProgramResponse.model_validate(p) for p in programs]


def calculate_crs(input: CRSInput) -> CRSResult:
    """Delegate to CRSCalculator and return the result."""
    return CRSCalculator.calculate(input)


async def match_pathways(
    session: AsyncSession, input: CRSInput
) -> list[PathwayMatchResponse]:
    """Calculate CRS score then match against active programs."""
    crs_result = CRSCalculator.calculate(input)
    programs = await get_programs(session)
    return PNPMatcher.match_programs(input, crs_result.total_score, programs)


def get_checklist() -> list[ChecklistItem]:
    """Return the standard post-landing checklist."""
    return [ChecklistItem(**item) for item in _POST_LANDING_CHECKLIST]


async def get_draws(session: AsyncSession) -> list[EEDrawResponse]:
    """Return recent Express Entry draws, newest first."""
    result = await session.execute(
        select(EEDraw).order_by(EEDraw.draw_date.desc()).limit(50)
    )
    draws = result.scalars().all()
    return [EEDrawResponse.model_validate(d) for d in draws]
