FROM python:3.11-slim

WORKDIR /app

COPY backend/pyproject.toml .
RUN pip install --upgrade pip && pip install -e ".[dev]" && pip install uvicorn

COPY backend/ .

RUN python seed.py || true

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]