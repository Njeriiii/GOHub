# Backend Dockerfile
# ./backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.dev.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application first (better layer caching)
COPY . .

# Set environment variables
ENV FLASK_APP=run.py
ENV PORT=5162
ENV HOST=0.0.0.0

# Create a directory for credentials
RUN mkdir -p /app/credentials

# Make sure create_db.py is executable
RUN chmod +x create_db.py

EXPOSE 5162

CMD ["gunicorn", "--bind", "0.0.0.0:5162", "run:app"]
