from flask import Flask, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os
import importlib
from google.oauth2 import service_account

from app.config import AppConfig
from flask_session import Session

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
login_manager = LoginManager()
jwt = JWTManager()  # Create JWT manager instance

def create_app(config_class=AppConfig):
    app = Flask(__name__)
    # Define allowed origins based on environment
    origins = [
        'http://localhost:3000',  # Local frontend
        'http://localhost:5000',  # Firebase local testing
        'http://localhost:5002',  # Additional local testing port
        'https://gohub-92b6b.web.app',  # Firebase hosting domain
        'https://gohub-92b6b.firebaseapp.com',  # Alternative Firebase domain
        'https://ngo-connect-backend-607773298065.us-west1.run.app'  # Cloud Run backend
    ]
    

    CORS(app, 
        resources={r"/*": {
            "origins": origins,
            "allow_credentials": True,  # Make sure this is True
            "expose_headers": ["Set-Cookie"],
            "allow_headers": ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "supports_credentials": True  # Add this line
        }})

    # Load config from environment variable or default to AppConfig
    config_class = os.getenv('CONFIG_CLASS', 'app.config.AppConfig')
    if isinstance(config_class, str):
        module_name, class_name = config_class.rsplit('.', 1)
        module = importlib.import_module(module_name)
        config_class = getattr(module, class_name)
    
    app.config.from_object(config_class)

    Session(app)
    
    # Initialize JWT with the app
    jwt.init_app(app)

    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)  # Initialize migrate with app and db
    login_manager.init_app(app)

    # JWT Configuration
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_HEADER_TYPE'] = 'Bearer'
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_ERROR_MESSAGE_KEY'] = 'msg'
    app.config['JWT_IDENTITY_CLAIM'] = 'sub'

    # Add a loader to convert the JWT subject to string before verification
    @jwt.decode_key_loader
    def decode_key_loader(jwt_headers, jwt_data):
        # Ensure subject is a string before JWT verification
        if 'sub' in jwt_data and not isinstance(jwt_data['sub'], str):
            jwt_data['sub'] = str(jwt_data['sub'])
        return app.config['JWT_SECRET_KEY']

    # Optional: Add error handler for more detailed error messages
    @jwt.invalid_token_loader
    def invalid_token_callback(error_string):
        app.logger.error(f"Invalid token error: {error_string}")
        return jsonify({
            'msg': 'Invalid token',
            'error_details': str(error_string)
        }), 401

    app.logger.info(f"Initializing database with URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
    # initialising db
    with app.app_context():
        try:
            db.create_all()
            app.logger.info("Database tables created successfully")
        except Exception as e:
            app.logger.error(f"Failed to create database tables: {str(e)}")
            raise

    # registering blueprints
    from app.auth.routes import auth as auth_blueprint
    from app.profile.routes import profile as profile_blueprint
    from app.main.routes import main as main_blueprint
    from app.claude.routes import claude as claude_blueprint

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(profile_blueprint)
    app.register_blueprint(main_blueprint)
    app.register_blueprint(claude_blueprint)

    return app
