from app import create_app, db
from flask_migrate import upgrade
import logging

app = create_app()
logger = logging.getLogger(__name__)

def run_migrations():
    try:
        with app.app_context():
            logger.info("Running database migrations...")
            upgrade()
            logger.info("Database migrations completed successfully")
    except Exception as e:
        logger.error(f"Migration failed: {str(e)}")
        raise

if __name__ == "__main__":
    run_migrations()