"""Cross-dialect column types.

Uses JSONB on Postgres (better indexing / query performance) and falls back
to generic JSON on SQLite or other dialects (for tests and local dev).
"""

from sqlalchemy import JSON, Uuid
from sqlalchemy.dialects.postgresql import JSONB as _PG_JSONB


def jsonb_column():
    """Return a JSON TypeEngine that emits JSONB on Postgres, JSON elsewhere."""
    return JSON().with_variant(_PG_JSONB(), "postgresql")


def uuid_column():
    """Return a UUID TypeEngine — native UUID on Postgres, CHAR(32) elsewhere.

    ``as_uuid=True`` is the default in SQLAlchemy 2.0, so values are returned
    as ``uuid.UUID`` objects regardless of dialect.
    """
    return Uuid()
