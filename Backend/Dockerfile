# Backend Dockerfile
# ./backend/Dockerfile
FROM --platform=linux/amd64 python:3.12-slim

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

# Create necessary directories
RUN mkdir -p /app/credentials
RUN mkdir -p /app/uploads
RUN mkdir -p /app/flask_session

# Make sure create_db.py is executable
RUN chmod +x create_db.py

# Set essential environment variables
ENV PYTHONUNBUFFERED=1

# Now that we know basic Flask works, let's use gunicorn for better production performance
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "1", "--preload", "run:app"]
