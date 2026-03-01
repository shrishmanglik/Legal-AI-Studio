"""
Contract review service — upload, extract text, detect clauses,
calculate risk score, and persist reviews.
"""

from __future__ import annotations

import io
import re
from uuid import UUID

from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException, ValidationException
from app.models.contracts import ClauseLibrary, ContractReview
from app.schemas.contracts import (
    ClauseFound,
    ClauseLibraryResponse,
    ContractReviewResponse,
    ContractUploadResponse,
)


# ---------------------------------------------------------------------------
# Built-in keyword patterns used when the clause library is empty or as
# a fallback.  Maps clause_type -> (display_name, list_of_regex_patterns).
# ---------------------------------------------------------------------------

_DEFAULT_CLAUSE_PATTERNS: dict[str, tuple[str, list[str]]] = {
    "termination": (
        "Termination Clause",
        [r"terminat(e|ion)", r"cancel(lation)?", r"end\s+of\s+(agreement|contract)"],
    ),
    "indemnification": (
        "Indemnification Clause",
        [r"indemnif(y|ication)", r"hold\s+harmless"],
    ),
    "limitation_of_liability": (
        "Limitation of Liability",
        [r"limit(ation)?\s+(of\s+)?liability", r"cap\s+on\s+damages"],
    ),
    "confidentiality": (
        "Confidentiality / NDA",
        [r"confidential(ity)?", r"non[\-\s]?disclosure", r"proprietary\s+information"],
    ),
    "governing_law": (
        "Governing Law",
        [r"governing\s+law", r"jurisdiction", r"applicable\s+law"],
    ),
    "dispute_resolution": (
        "Dispute Resolution",
        [r"dispute\s+resolution", r"arbitrat(e|ion)", r"mediat(e|ion)"],
    ),
    "force_majeure": (
        "Force Majeure",
        [r"force\s+majeure", r"act\s+of\s+god"],
    ),
    "non_compete": (
        "Non-Compete",
        [r"non[\-\s]?compet(e|ition)", r"restrictive\s+covenant"],
    ),
    "intellectual_property": (
        "Intellectual Property",
        [r"intellectual\s+property", r"\bIP\b", r"patent", r"copyright"],
    ),
    "payment_terms": (
        "Payment Terms",
        [r"payment\s+term", r"invoic(e|ing)", r"net\s+\d+"],
    ),
}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

async def upload_and_review(
    session: AsyncSession,
    file: UploadFile,
    user_id: UUID,
) -> ContractUploadResponse:
    """Read an uploaded file, extract text, detect clauses, and persist a review."""
    filename = file.filename or "unknown"
    content = await file.read()

    # Determine extraction strategy
    lower = filename.lower()
    if lower.endswith(".pdf"):
        text = _extract_text_from_pdf(content)
    elif lower.endswith(".docx"):
        text = _extract_text_from_docx(content)
    elif lower.endswith(".txt"):
        text = content.decode("utf-8", errors="replace")
    else:
        raise ValidationException(
            "Unsupported file format. Please upload a PDF, DOCX, or TXT file."
        )

    if not text.strip():
        raise ValidationException("Could not extract any text from the uploaded file.")

    # Load clause library from DB (may be empty for fresh installs)
    lib_result = await session.execute(select(ClauseLibrary))
    clause_lib = lib_result.scalars().all()
    standard_types = [c.clause_type for c in clause_lib] if clause_lib else list(
        _DEFAULT_CLAUSE_PATTERNS.keys()
    )

    # Detect & score
    clauses_found = _detect_clauses(text, clause_lib)
    found_types = [c.clause_type for c in clauses_found]
    missing = _find_missing_clauses(found_types, standard_types)
    risk_score = _calculate_risk_score(missing, standard_types)

    summary = (
        f"Reviewed '{filename}': found {len(clauses_found)} clause(s), "
        f"missing {len(missing)} standard clause(s). Risk score: {risk_score:.1f}%."
    )

    review = ContractReview(
        user_id=user_id,
        filename=filename,
        status="completed",
        risk_score=risk_score,
        summary=summary,
        clauses_found=[c.model_dump() for c in clauses_found],
        missing_clauses=missing,
    )
    session.add(review)
    await session.commit()
    await session.refresh(review)

    return ContractUploadResponse(
        id=review.id,
        filename=review.filename,
        status=review.status,
    )


async def get_review(
    session: AsyncSession, review_id: UUID, user_id: UUID
) -> ContractReviewResponse:
    """Fetch a single contract review belonging to the given user."""
    result = await session.execute(
        select(ContractReview).where(
            ContractReview.id == review_id,
            ContractReview.user_id == user_id,
        )
    )
    review = result.scalar_one_or_none()
    if review is None:
        raise NotFoundException("Contract review not found")

    return _review_to_response(review)


async def list_reviews(
    session: AsyncSession, user_id: UUID
) -> list[ContractReviewResponse]:
    """List all contract reviews for a user, newest first."""
    result = await session.execute(
        select(ContractReview)
        .where(ContractReview.user_id == user_id)
        .order_by(ContractReview.created_at.desc())
    )
    reviews = result.scalars().all()
    return [_review_to_response(r) for r in reviews]


async def get_clause_library(session: AsyncSession) -> list[ClauseLibraryResponse]:
    """Return all entries in the clause library."""
    result = await session.execute(select(ClauseLibrary))
    clauses = result.scalars().all()
    return [ClauseLibraryResponse.model_validate(c) for c in clauses]


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _extract_text_from_pdf(content: bytes) -> str:
    """Extract text from a PDF using PyMuPDF (fitz)."""
    try:
        import fitz  # PyMuPDF
    except ImportError:
        raise ValidationException(
            "PDF processing library (PyMuPDF) is not installed."
        )

    text_parts: list[str] = []
    with fitz.open(stream=content, filetype="pdf") as doc:
        for page in doc:
            text_parts.append(page.get_text())
    return "\n".join(text_parts)


def _extract_text_from_docx(content: bytes) -> str:
    """Extract text from a DOCX file using python-docx."""
    try:
        from docx import Document
    except ImportError:
        raise ValidationException(
            "DOCX processing library (python-docx) is not installed."
        )

    doc = Document(io.BytesIO(content))
    return "\n".join(paragraph.text for paragraph in doc.paragraphs)


def _detect_clauses(
    text: str,
    clause_lib: list | None = None,
) -> list[ClauseFound]:
    """Detect clauses in contract text using keyword matching.

    If a populated clause library is provided from the database, patterns
    are derived from each library entry's name and clause_type.  Otherwise
    the built-in ``_DEFAULT_CLAUSE_PATTERNS`` are used.
    """
    found: list[ClauseFound] = []
    lower_text = text.lower()

    # Build patterns dict: clause_type -> (display_name, [regex_patterns])
    patterns: dict[str, tuple[str, list[str]]]
    if clause_lib:
        patterns = {}
        for entry in clause_lib:
            # Use library name words as simple pattern sources
            name_pattern = re.escape(entry.name.lower())
            type_pattern = re.escape(entry.clause_type.lower().replace("_", " "))
            patterns[entry.clause_type] = (
                entry.name,
                [name_pattern, type_pattern],
            )
    else:
        patterns = _DEFAULT_CLAUSE_PATTERNS

    for clause_type, (display_name, regex_list) in patterns.items():
        best_match = None
        best_confidence = 0.0

        for pattern in regex_list:
            matches = list(re.finditer(pattern, lower_text, re.IGNORECASE))
            if matches:
                # Confidence heuristic: more matches -> higher confidence
                confidence = min(0.5 + len(matches) * 0.1, 1.0)
                if confidence > best_confidence:
                    best_confidence = confidence
                    # Extract a surrounding excerpt (up to 200 chars)
                    m = matches[0]
                    start = max(0, m.start() - 50)
                    end = min(len(text), m.end() + 150)
                    best_match = text[start:end].strip()

        if best_match is not None:
            found.append(
                ClauseFound(
                    clause_type=clause_type,
                    name=display_name,
                    confidence=round(best_confidence, 2),
                    text_excerpt=best_match,
                )
            )

    return found


def _find_missing_clauses(
    found_types: list[str], all_standard_types: list[str]
) -> list[str]:
    """Return clause types present in the standard set but not found in the document."""
    found_set = set(found_types)
    return [ct for ct in all_standard_types if ct not in found_set]


def _calculate_risk_score(
    missing: list[str], all_standard: list[str]
) -> float:
    """Risk score as percentage of missing standard clauses."""
    if not all_standard:
        return 0.0
    return len(missing) / len(all_standard) * 100


def _review_to_response(review: ContractReview) -> ContractReviewResponse:
    """Convert a ContractReview ORM instance to its response schema."""
    clauses_data = review.clauses_found or []
    clauses = [ClauseFound(**c) for c in clauses_data] if clauses_data else []
    missing = review.missing_clauses or []

    return ContractReviewResponse(
        id=review.id,
        filename=review.filename,
        status=review.status,
        risk_score=review.risk_score,
        summary=review.summary,
        clauses_found=clauses,
        missing_clauses=missing,
        created_at=review.created_at,
    )
