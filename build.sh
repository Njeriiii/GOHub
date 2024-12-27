#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Python dependencies..."
pip install -r Backend/requirements.prod.txt

cd Backend

echo "Verifying database connection..."
python verify_db.py

# Run migrations using the new manage_db script
if [ -d "migrations" ] && [ -d "migrations/versions" ] && [ "$(ls -A migrations/versions)" ]; then
    echo "Found existing migrations. Running database migrations..."
    export FLASK_APP=run.py
    python manage_db.py
else
    echo "No migrations found or versions directory is empty. Skipping migrations."
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

echo "Build completed successfully!"