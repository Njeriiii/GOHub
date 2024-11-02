#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Python dependencies..."
pip install -r Backend/requirements.prod.txt

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