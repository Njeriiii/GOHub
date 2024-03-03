from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from app.config import AppConfig
from flask_session import Session

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
login_manager = LoginManager()


def create_app(config_class=AppConfig):
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    app.config.from_object(config_class)

    Session(app)

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    # initialising db
    with app.app_context():
        db.create_all()

    # registering blueprints
    from app.auth.routes import auth as auth_blueprint

    app.register_blueprint(auth_blueprint)

    return app
