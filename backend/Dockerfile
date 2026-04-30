# ---- base ----
FROM python:3.11-slim AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libcairo2 \
    libgdk-pixbuf-2.0-0 \
    libffi-dev \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ---- deps ----
FROM base AS deps

RUN pip install --no-cache-dir poetry==1.8.2 \
    && poetry config virtualenvs.create false

COPY pyproject.toml poetry.lock* ./
RUN poetry install --no-root --no-interaction --no-ansi

# ---- development ----
FROM deps AS development

COPY . .
RUN poetry install --no-interaction --no-ansi

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8004", "--reload"]

# ---- production ----
FROM base AS production

COPY --from=deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin

COPY app/ ./app/
COPY alembic/ ./alembic/
COPY alembic.ini ./

RUN useradd --create-home --shell /bin/bash appuser
USER appuser

ENV PORT=8004

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8004"]
