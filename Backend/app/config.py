import os
import secrets

from dotenv import load_dotenv
from datetime import timedelta
import os

load_dotenv()


class AppConfig:
    SECRET_KEY = secrets.token_hex(24)
    # Database configuration
    database_url = os.getenv("SQLALCHEMY_DATABASE_URI")
    if database_url and database_url.startswith("postgres://"):
        # Convert postgres:// to postgresql:// for newer SQLAlchemy versions
        database_url = database_url.replace("postgres://", "postgresql://")
    
    SQLALCHEMY_DATABASE_URI = database_url or "sqlite:///db.sqlite"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_PRE_PING = True
    SESSION_TYPE = "filesystem"
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_DOMAIN = '.onrender.com'  # Allow cookie to be shared between subdomains
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_SERVER = "smtp.googlemail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    UPLOAD_FOLDER = os.path.abspath("uploads")
    ENV = os.getenv("ENV")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    
    # JWT settings
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_TYPE = 'Bearer'
    JWT_HEADER_NAME = 'Authorization'
    JWT_ERROR_MESSAGE_KEY = 'msg'

class TestConfig(AppConfig):
    SQLALCHEMY_DATABASE_URI = "sqlite://"
    TESTING = True
