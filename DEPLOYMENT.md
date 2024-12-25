# Deployment Configuration

This application is deployed using Google Cloud Platform and Firebase, with automated CI/CD through GitHub Actions.

## Overview
- Frontend: Firebase Hosting (https://gohub-92b6b.web.app)
- Backend: Google Cloud Run (https://ngo-connect-backend-607773298065.us-west1.run.app)
- Database: Cloud SQL PostgreSQL (ngo-connect-db)
- Region: us-west1

## Initial Setup

### 1. Database Setup (Cloud SQL)
- PostgreSQL 15 instance named 'ngo-connect-db'
- View instance details:
  ```bash
  gcloud sql instances describe ngo-connect-db
  ```

#### Local Database Connection
1. Download Cloud SQL Proxy:
   ```bash
   # Mac
   curl -o cloud-sql-proxy https://dl.google.com/cloudsql/cloud_sql_proxy.darwin.amd64
   # Linux
   wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud-sql-proxy
   
   chmod +x cloud-sql-proxy
   ```

2. Start Proxy:
   ```bash
   ./cloud-sql-proxy gohub-92b6b:us-west1:ngo-connect-db
   ```

**Why Cloud SQL Proxy?**
- Secure local access to Cloud SQL
- Automatic authentication and encryption
- No IP whitelisting needed
- Required for local development
- Enables local testing with production database

### 2. Backend Setup (Cloud Run)

#### Environment Variables
Required environment variables in Cloud Run:
- DATABASE_URL: PostgreSQL connection string
- FLASK_APP: Entry point for Flask application
- GOOGLE_APPLICATION_CREDENTIALS: Path to service account credentials
- JWT_SECRET_KEY: For JWT token generation/validation

#### CORS Configuration
Add to Flask application:
```python
origins = [
    'http://localhost:3000',  # React development
    'http://localhost:5000',  # Firebase local
    'http://localhost:5002',  # Firebase alternate port
    'https://gohub-92b6b.web.app',
    'https://gohub-92b6b.firebaseapp.com',
    'https://ngo-connect-backend-607773298065.us-west1.run.app'
]

CORS(app, 
    resources={r"/*": {
        "origins": origins,
        "allow_credentials": True,
        "expose_headers": ["Set-Cookie"],
        "allow_headers": ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "supports_credentials": True
    }})
```

#### Deployment Commands
```bash
# View services
gcloud run services list
gcloud run services describe ngo-connect-backend --region=us-west1

# Deploy
gcloud run deploy ngo-connect-backend \
    --source . \
    --region us-west1
```

### 3. Frontend Setup (Firebase)

#### Environment Configuration
Create `.env.production` (not tracked in git):
```plaintext
REACT_APP_BASE_API_URL=https://ngo-connect-backend-607773298065.us-west1.run.app
```

#### Initial Firebase Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select options:
# - Hosting
# - Choose your project
# - Build directory: build
# - Single page app: yes
# - Don't overwrite index.html: no
```

## Development Workflow

### Local Development
1. Start Cloud SQL Proxy in a separate terminal:
   ```bash
   ./cloud-sql-proxy gohub-92b6b:us-west1:ngo-connect-db
   ```

2. Backend:
   - Set up environment variables
   - Run Flask development server

3. Frontend:
   ```bash
   npm install        # Install dependencies
   npm start         # Development server on :3000
   ```

### Testing Production Build
```bash
# Build production version
npm run build        

# Test locally using Firebase
firebase serve      # Default port :5000
# or
firebase serve --port=5002  # Custom port
```

### Production Deployment
```bash
# Build and deploy
npm run build
firebase deploy

# Verify deployment
firebase hosting:sites:list
```

## Monitoring & Logs

### Cloud Run Logs
```bash
# View detailed service logs with filters
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=ngo-connect-backend" --limit 50

# Quick view of recent logs (simplified)
gcloud run services logs read ngo-connect-backend --region us-west1
```

Key Log Information:
- Request details
- Error messages
- Authentication issues
- CORS-related problems
- Database connection status

### Firebase Logs
```bash
# View Firebase hosting logs
firebase functions:log
```

Shows:
- Deployment status
- Hosting errors
- Access logs
- Performance metrics

### Deployment Status
```bash
# List all Firebase hosting sites
firebase hosting:sites:list

# View detailed hosting information
firebase hosting:site:get
```
