# Backend/manage_db.py
import sys
import logging
from flask_migrate import upgrade
from app import create_app, db

# Set up root logger to ensure all logs are captured
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# Get logger for this module
logger = logging.getLogger(__name__)

# Ensure alembic logging is visible
logging.getLogger('alembic').setLevel(logging.INFO)

def run_migrations():
    try:
        app = create_app()
        with app.app_context():
            logger.info("Starting database migrations...")
            
            # Add explicit logging before and after upgrade
            logger.info("Running upgrade command...")
            result = upgrade()
            logger.info(f"Upgrade command completed with result: {result}")
            
            # Verify database state after migration
            logger.info("Verifying database state...")
            with db.engine.connect() as conn:
                logger.info("Database connection successful")
                
            logger.info("Database migrations completed successfully")
            return True
            
    except Exception as e:
        logger.error(f"Migration failed: {str(e)}", exc_info=True)
        return False
    finally:
        logger.info("Migration process finished")

if __name__ == "__main__":
    try:
        success = run_migrations()
        exit_code = 0 if success else 1
        logger.info(f"Exiting with code {exit_code}")
        sys.exit(exit_code)
    except KeyboardInterrupt:
        logger.info("Migration interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        sys.exit(1)