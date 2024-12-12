# Backend Dockerfile
# ./backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.dev.txt .
RUN pip install --no-cache-dir -r requirements.dev.txt

# Copy credentials (to include them in the image)
COPY flawless-snow-443501-q3-85e4441a1dd7.json /app/credentials/google-credentials.json

# Copy the rest of the application
COPY . .

# Set the environment variable for credentials
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/google-credentials.json
ENV GOOGLE_CLOUD_PROJECT=flawless-snow-443501-q3

EXPOSE 5162

CMD ["gunicorn", "--bind", "0.0.0.0:5162", "run:app"]
