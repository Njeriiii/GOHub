import os
import secrets

from dotenv import load_dotenv

load_dotenv()


class AppConfig:
    SECRET_KEY = secrets.token_hex(24)
    SQLALCHEMY_DATABASE_URI = (
        os.getenv("SQLALCHEMY_DATABASE_URI") or "sqlite:///db.sqlite"
    )
    SQLALCHEMY_PRE_PING = True
    SESSION_TYPE = "filesystem"
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_SERVER = "smtp.googlemail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    UPLOAD_FOLDER = os.path.abspath("uploads")
    ENV = os.getenv("ENV")


class TestConfig(AppConfig):
    SQLALCHEMY_DATABASE_URI = "sqlite://"
    TESTING = True
