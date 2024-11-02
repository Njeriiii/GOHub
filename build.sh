#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Python dependencies..."
pip install -r backend/requirements.prod.txt

echo "Installing frontend dependencies..."
cd Frontend
npm install

echo "Building frontend..."
npm run build
cd ..

echo "Creating logs directory..."
mkdir -p logs

echo "Build completed successfully!"