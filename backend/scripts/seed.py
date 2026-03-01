#!/usr/bin/env python3
"""
Database seed script for LegalAI Studio.

Inserts immigration programs, employment standards, clause library entries,
and document templates into the database.

Usage:
    python -m scripts.seed          # from backend/
    python scripts/seed.py          # from backend/
"""

import asyncio
import sys
from pathlib import Path

# Ensure the backend package is importable when running as a script
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.models import (
    Base,
    ImmigrationProgram,
    EmploymentStandard,
    ClauseLibrary,
    DocumentTemplate,
)
from app.data.immigration_programs import IMMIGRATION_PROGRAMS
from app.data.employment_standards import EMPLOYMENT_STANDARDS
from app.data.clause_library import CLAUSE_LIBRARY


# ---------------------------------------------------------------------------
# NDA template content (loaded from the Jinja2 file on disk)
# ---------------------------------------------------------------------------
NDA_TEMPLATE_PATH = (
    Path(__file__).resolve().parent.parent
    / "app"
    / "data"
    / "document_templates"
    / "nda.jinja2"
)

NDA_VARIABLES_SCHEMA = {
    "type": "object",
    "required": [
        "party_a_name",
        "party_a_address",
        "party_b_name",
        "party_b_address",
        "effective_date",
        "term_years",
        "jurisdiction",
        "governing_law",
    ],
    "properties": {
        "party_a_name": {
            "type": "string",
            "description": "Full legal name of Party A",
        },
        "party_a_address": {
            "type": "string",
            "description": "Full mailing address of Party A",
        },
        "party_b_name": {
            "type": "string",
            "description": "Full legal name of Party B",
        },
        "party_b_address": {
            "type": "string",
            "description": "Full mailing address of Party B",
        },
        "effective_date": {
            "type": "string",
            "format": "date",
            "description": "Effective date of the agreement (YYYY-MM-DD)",
        },
        "term_years": {
            "type": "integer",
            "minimum": 1,
            "description": "Duration of the NDA in years",
        },
        "jurisdiction": {
            "type": "string",
            "description": "City/Province for exclusive court jurisdiction",
        },
        "governing_law": {
            "type": "string",
            "description": "Province/Territory whose laws govern the agreement",
        },
    },
}


# ---------------------------------------------------------------------------
# Seed helpers
# ---------------------------------------------------------------------------


async def _table_count(session: AsyncSession, model) -> int:
    """Return the row count for a model's table."""
    result = await session.execute(select(func.count()).select_from(model))
    return result.scalar_one()


async def seed_immigration_programs(session: AsyncSession) -> int:
    """Seed immigration programs. Returns number of rows inserted."""
    count = await _table_count(session, ImmigrationProgram)
    if count > 0:
        print(f"  immigration_programs: already has {count} rows -- skipping")
        return 0

    for data in IMMIGRATION_PROGRAMS:
        session.add(ImmigrationProgram(**data))

    await session.flush()
    inserted = len(IMMIGRATION_PROGRAMS)
    print(f"  immigration_programs: inserted {inserted} rows")
    return inserted


async def seed_employment_standards(session: AsyncSession) -> int:
    """Seed Ontario employment standards. Returns number of rows inserted."""
    count = await _table_count(session, EmploymentStandard)
    if count > 0:
        print(f"  employment_standards: already has {count} rows -- skipping")
        return 0

    for data in EMPLOYMENT_STANDARDS:
        session.add(EmploymentStandard(**data))

    await session.flush()
    inserted = len(EMPLOYMENT_STANDARDS)
    print(f"  employment_standards: inserted {inserted} rows")
    return inserted


async def seed_clause_library(session: AsyncSession) -> int:
    """Seed contract clause library. Returns number of rows inserted."""
    count = await _table_count(session, ClauseLibrary)
    if count > 0:
        print(f"  clause_library: already has {count} rows -- skipping")
        return 0

    for data in CLAUSE_LIBRARY:
        session.add(ClauseLibrary(**data))

    await session.flush()
    inserted = len(CLAUSE_LIBRARY)
    print(f"  clause_library: inserted {inserted} rows")
    return inserted


async def seed_document_templates(session: AsyncSession) -> int:
    """Seed document templates (NDA). Returns number of rows inserted."""
    count = await _table_count(session, DocumentTemplate)
    if count > 0:
        print(f"  document_templates: already has {count} rows -- skipping")
        return 0

    # Load NDA Jinja2 template from disk
    nda_content = NDA_TEMPLATE_PATH.read_text(encoding="utf-8")

    nda_template = DocumentTemplate(
        name="Mutual Non-Disclosure Agreement (NDA)",
        category="confidentiality",
        description=(
            "A comprehensive mutual NDA template suitable for Canadian businesses. "
            "Covers confidential information exchange between two parties with "
            "standard protections including survival clauses, compelled disclosure "
            "carve-outs, and equitable remedies."
        ),
        template_content=nda_content,
        jurisdiction="Ontario, Canada",
        variables_schema=NDA_VARIABLES_SCHEMA,
    )
    session.add(nda_template)

    await session.flush()
    print("  document_templates: inserted 1 row (Mutual NDA)")
    return 1


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------


async def run_seed() -> None:
    """Execute all seed functions inside a single transaction."""
    print("=" * 60)
    print("LegalAI Studio -- Database Seed")
    print("=" * 60)

    async with AsyncSessionLocal() as session:
        async with session.begin():
            total = 0
            total += await seed_immigration_programs(session)
            total += await seed_employment_standards(session)
            total += await seed_clause_library(session)
            total += await seed_document_templates(session)

        # session.begin() auto-commits on success

    print("-" * 60)
    print(f"Seed complete. Total rows inserted: {total}")
    print("=" * 60)


def main() -> None:
    asyncio.run(run_seed())


if __name__ == "__main__":
    main()
