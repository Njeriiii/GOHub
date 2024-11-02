#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Python dependencies..."
pip install -r Backend/requirements.prod.txt

echo "Initializing database..."
cd Backend
python create_db.py

# Run migrations if they exist
if [ -d "migrations" ]; then
    echo "Running database migrations..."
    export FLASK_APP=run.py
    flask db upgrade
else
    echo "No migrations directory found. Skipping migrations."
fi
cd ..

echo "Installing frontend dependencies..."
cd Frontend
npm install

echo "Building frontend..."
npm run build
cd ..

echo "Creating logs directory..."
mkdir -p logs

echo "Running database migrations..."
cd Backend
flask db upgrade
cd ..

echo "Build completed successfully!"