# Backend/manage_db.py
import sys
import logging
from flask_migrate import upgrade
from app import create_app, db
from alembic.util.exc import CommandError
from sqlalchemy.sql import text

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
logging.getLogger('sqlalchemy').setLevel(logging.INFO)

def run_migrations():
    try:
        app = create_app()
        with app.app_context():
            logger.info("Starting database migrations...")
            
            # Verify database connection first
            try:
                with db.engine.connect() as conn:
                    result = conn.execute(text("SELECT 1"))
                    logger.info("Database connection verified")
            except Exception as e:
                logger.error(f"Database connection failed: {str(e)}")
                return False
            
            try:
                logger.info("Running upgrade command...")
                result = upgrade(sql=True)  # Add sql=True to see the SQL being executed
                logger.info(f"Migration SQL: {result}")
                
                result = upgrade()  # Actually run the migration
                logger.info(f"Upgrade command completed with result: {result}")
            except CommandError as e:
                logger.error(f"Alembic command error: {str(e)}")
                return False
            except Exception as e:
                logger.error(f"Migration error: {str(e)}", exc_info=True)
                return False
            
            # Verify database state after migration
            logger.info("Verifying database state...")
            with db.engine.connect() as conn:
                logger.info("Post-migration database connection successful")
                
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