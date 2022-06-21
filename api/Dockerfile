# ------------------------------------------------------------
# Base layer
# ------------------------------------------------------------
FROM python:3.9-slim as base

LABEL maintainer="Wille <villeristimaki@gmail.com>"

ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED 1
ENV TINI_VERSION v0.19.0

RUN apt update -y && apt-get install -y \
    python3-dev \
    build-essential \
    git

RUN addgroup --system fastapi \
    && adduser --system --ingroup fastapi fastapi

RUN pip install --upgrade pip
RUN pip install --no-cache-dir poetry==1.1.*

COPY poetry.lock pyproject.toml /

ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini

RUN chmod +x /tini


# ------------------------------------------------------------
# Production-stage - no dev-dependencies & clear cache
# ------------------------------------------------------------
FROM base as production

RUN poetry config virtualenvs.create false \
    && poetry install --no-dev --no-root \
    && rm -rf ~/.cache

COPY --chown=fastapi:fastapi . /app

USER fastapi

WORKDIR /app

ENTRYPOINT ["/tini", "--"]

CMD gunicorn src.main:app -c gunicorn_config.py


# ------------------------------------------------------------
# Development-stage
# ------------------------------------------------------------
FROM base as development

RUN poetry config virtualenvs.create false \
    && poetry install --no-root

COPY --chown=fastapi:fastapi . /app

USER fastapi

WORKDIR /app

ENTRYPOINT ["/tini", "--"]

CMD gunicorn src.main:app -c gunicorn_config.py
