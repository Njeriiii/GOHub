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

# In your Dockerfile, ensure you're copying migrations
COPY migrations ./migrations

# Create necessary directories
RUN mkdir -p /app/credentials
RUN mkdir -p /app/uploads
RUN mkdir -p /app/flask_session

RUN pip install "cloud-sql-python-connector[pg8000]>=1.15.0"
RUN mkdir -p /cloudsql

# Make sure verify_db.py is executable
COPY verify_db.py .
RUN chmod +x verify_db.py

# Set essential environment variables
ENV PYTHONUNBUFFERED=1

# Expose the port
EXPOSE 8080

RUN echo "#!/bin/sh" > /startup-check.sh && \
    echo "if [ ! -f \$GOOGLE_APPLICATION_CREDENTIALS ]; then" >> /startup-check.sh && \
    echo "  echo 'Google credentials file not found!'" >> /startup-check.sh && \
    echo "  ls -la /secrets/google-creds/" >> /startup-check.sh && \
    echo "fi" >> /startup-check.sh && \
    chmod +x /startup-check.sh

ENV PORT 8080
CMD /startup-check.sh && \
    python verify_db.py && \
    sleep 5 && \
    gunicorn --bind :8080 --workers 1 --threads 8 --timeout 0 run:app