"""
Legal Q&A service — answer questions using a Claude API call (when
configured) with a SHA-256 cache layer backed by the LegalAICache table.
"""

from __future__ import annotations

import hashlib
import re
from datetime import datetime, timedelta, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import ValidationException
from app.models.legal import LegalAICache
from app.schemas.legal import LegalQAHistoryItem, LegalQAResponse


# Cache entries are valid for 7 days
_CACHE_TTL_DAYS = 7


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

async def answer_question(
    session: AsyncSession,
    question: str,
    jurisdiction: str,
    user_id: UUID,
) -> LegalQAResponse:
    """Answer a legal question, using cache when available.

    Flow:
    1. Normalise the question and compute a SHA-256 cache key.
    2. Check LegalAICache for a non-expired hit.
    3. On miss: call Claude API if CLAUDE_API_KEY is set, otherwise return
       a helpful fallback answer.
    4. Store the result in the cache.
    """
    if not question.strip():
        raise ValidationException("Question must not be empty")

    normalized = _normalize_question(question)
    cache_key = hashlib.sha256(
        (normalized + "|" + jurisdiction).encode()
    ).hexdigest()

    now = datetime.now(timezone.utc)

    # --- Cache lookup ---
    result = await session.execute(
        select(LegalAICache).where(
            LegalAICache.query_hash == cache_key,
            LegalAICache.expires_at > now,
        )
    )
    cached_entry = result.scalar_one_or_none()

    if cached_entry is not None:
        return LegalQAResponse(
            question=question,
            answer=cached_entry.response_text,
            jurisdiction=jurisdiction,
            sources=[],
            cached=True,
        )

    # --- Generate answer ---
    if settings.CLAUDE_API_KEY:
        answer_text = await _call_claude_api(question, jurisdiction)
    else:
        answer_text = (
            f"Thank you for your question about '{question}' in the "
            f"'{jurisdiction}' jurisdiction. This is an AI-generated informational "
            "response. For a detailed, personalised answer please configure the "
            "Claude API key or consult a licensed legal professional.\n\n"
            "Key considerations:\n"
            "- Always verify information against official government sources.\n"
            "- Legal rules vary by province and territory.\n"
            "- Time-sensitive matters should be reviewed by a lawyer promptly."
        )

    # --- Persist to cache ---
    cache_entry = LegalAICache(
        query_hash=cache_key,
        query_text=question,
        response_text=answer_text,
        expires_at=now + timedelta(days=_CACHE_TTL_DAYS),
    )
    session.add(cache_entry)
    await session.commit()

    return LegalQAResponse(
        question=question,
        answer=answer_text,
        jurisdiction=jurisdiction,
        sources=[],
        cached=False,
    )


async def get_history(
    session: AsyncSession, user_id: UUID
) -> list[LegalQAHistoryItem]:
    """Return cached Q&A entries as a history list (most recent first).

    Note: In a full implementation this would be stored per-user.  For now
    we return globally cached entries so the feature is functional.
    """
    result = await session.execute(
        select(LegalAICache).order_by(LegalAICache.created_at.desc()).limit(50)
    )
    entries = result.scalars().all()
    return [
        LegalQAHistoryItem(
            id=e.id,
            question=e.query_text,
            answer=e.response_text,
            jurisdiction="federal",  # stored entries don't track jurisdiction separately
            created_at=e.created_at,
        )
        for e in entries
    ]


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _normalize_question(q: str) -> str:
    """Lowercase, strip, and collapse whitespace."""
    q = q.lower().strip()
    q = re.sub(r"\s+", " ", q)
    return q


async def _call_claude_api(question: str, jurisdiction: str) -> str:
    """Call the Anthropic Claude API to generate a legal-informational answer."""
    try:
        import httpx
    except ImportError:
        return (
            "The HTTP client library (httpx) is not installed. "
            "Please install it to enable AI-powered answers."
        )

    system_prompt = (
        "You are a helpful Canadian legal information assistant. "
        "Provide accurate, well-structured information based on Canadian law. "
        "Always include a disclaimer that this is not legal advice. "
        f"Focus on the '{jurisdiction}' jurisdiction when applicable."
    )

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": settings.CLAUDE_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-sonnet-4-20250514",
                    "max_tokens": 1024,
                    "system": system_prompt,
                    "messages": [{"role": "user", "content": question}],
                },
            )
            response.raise_for_status()
            data = response.json()
            # Extract text from the first content block
            content_blocks = data.get("content", [])
            if content_blocks:
                return content_blocks[0].get("text", "No response generated.")
            return "No response generated."
        except httpx.HTTPStatusError as exc:
            return (
                f"AI service returned an error (HTTP {exc.response.status_code}). "
                "Please try again later or consult a legal professional."
            )
        except httpx.RequestError:
            return (
                "Could not reach the AI service. "
                "Please check your network connection and try again."
            )
