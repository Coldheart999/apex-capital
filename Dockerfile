FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY backend/pyproject.toml .
RUN pip install --upgrade pip \
    && pip install -e ".[dev]" \
    && pip install uvicorn gunicorn

# Copy source
COPY backend/ .

# Expose port
EXPOSE 8000

# Run migrations and seed
RUN python seed.py || true

# Start server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]