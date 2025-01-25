# app/config.py
import os
import secrets

from dotenv import load_dotenv
from datetime import timedelta
import os

load_dotenv()


class AppConfig:
    SECRET_KEY = secrets.token_hex(24)
    # Database configuration
    database_url = os.getenv("DATABASE_URL")
    if database_url and database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://")
    
    # Check if running locally or in Cloud Run
    if os.getenv('K_SERVICE'):  # Running in Cloud Run
        # Use secret for password in production
        db_password = os.getenv('DB_PASSWORD')
        if db_password:
            SQLALCHEMY_DATABASE_URI = f"postgresql://postgres:{db_password}@/ngo_connect?host=/cloudsql/gohub-92b6b:us-west1:ngo-connect-db"
        else:
            SQLALCHEMY_DATABASE_URI = database_url
    else:  # Running locally
        SQLALCHEMY_DATABASE_URI = "sqlite:///db.sqlite"
    
    # Determine database type to set appropriate configuration
    is_sqlite = SQLALCHEMY_DATABASE_URI.startswith('sqlite')
    
    # Base SQLAlchemy configuration
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configure engine options based on database type
    if is_sqlite:
        SQLALCHEMY_ENGINE_OPTIONS = {
            'pool_pre_ping': True,
            'pool_recycle': 300,
            'pool_size': 10,
            'max_overflow': 5
        }
    else:  # PostgreSQL configuration
        SQLALCHEMY_ENGINE_OPTIONS = {
            'pool_pre_ping': True,
            'pool_recycle': 300,
            'pool_timeout': 900,
            'pool_size': 10,
            'max_overflow': 5,
            'connect_args': {
                'connect_timeout': 30
            } if not is_sqlite else {}
        }
    
    # Session configuration
    SESSION_TYPE = "filesystem"
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_DOMAIN = '.onrender.com' if os.getenv('FLASK_ENV') == 'production' else None
    
    # Mail configuration
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_SERVER = "smtp.googlemail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    
    # File upload configuration
    UPLOAD_FOLDER = os.path.abspath("uploads")
    ENV = os.getenv("FLASK_ENV", "production")
    
    # JWT settings
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_TYPE = 'Bearer'
    JWT_HEADER_NAME = 'Authorization'
    JWT_ERROR_MESSAGE_KEY = 'msg'

    # Google Cloud configuration
    GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
    GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

class TestConfig(AppConfig):
    SQLALCHEMY_DATABASE_URI = "sqlite://"
    TESTING = True
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True
    }  # Simplified options for testing