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

# Copy the rest of the application
COPY . .

EXPOSE 5162

CMD ["gunicorn", "--bind", "0.0.0.0:5162", "run:app"]