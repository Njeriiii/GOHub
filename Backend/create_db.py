import logging
import sys
from sqlalchemy import inspect
from flask_migrate import Migrate, upgrade
from app import create_app, db
from app.models import User, OrgProfile, OrgInitiatives, OrgProjects, SkillsNeeded, FocusArea, SocialMediaLink

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = create_app()


def verify_db_connection():
    try:
        with app.app_context():
            # Test database connection
            db.session.execute('SELECT 1')
            logger.info("Database connection successful")
            return True
    except Exception as e:
        logger.error(f"Database connection failed: {str(e)}")
        return False
    

def reset_db():
    max_retries = 3
    current_try = 0
    
    while current_try < max_retries:
        try:
            with app.app_context():
                logger.info(f"Starting database migration (attempt {current_try + 1}/{max_retries})...")
                
                # Verify connection first
                if not verify_db_connection():
                    raise Exception("Could not establish database connection")
                
                # Run migrations
                upgrade()
                logger.info("Database migrations completed successfully.")
                
                # Verify tables using inspector
                inspector = inspect(db.engine)
                tables = inspector.get_table_names()
                logger.info(f"Created tables: {', '.join(tables)}")
                
                # Additional verification
                logger.info("Verifying key tables...")
                expected_tables = [
                    'user', 'org_profile', 'org_initiatives', 'org_projects', 
                    'skills_needed', 'focus_area', 'social_media_link', 'translation_cache'
                ]
                missing_tables = [table for table in expected_tables if table not in tables]
                
                if missing_tables:
                    logger.warning(f"Missing tables: {', '.join(missing_tables)}")
                    raise Exception(f"Missing required tables: {', '.join(missing_tables)}")
                else:
                    logger.info("All expected tables are present.")
                
                # Verify table structures
                for table in expected_tables:
                    if table in tables:
                        columns = [c['name'] for c in inspector.get_columns(table)]
                        logger.info(f"Table {table} columns: {', '.join(columns)}")
                
                return True
                
        except Exception as e:
            current_try += 1
            logger.error(f"Error initializing database (attempt {current_try}/{max_retries}): {str(e)}")
            if current_try >= max_retries:
                logger.critical("Failed to initialize database after maximum retry attempts")
                raise e
            import time
            time.sleep(5)  # Wait 5 seconds before retrying

if __name__ == "__main__":
    try:
        success = reset_db()
        if not success:
            sys.exit(1)
    except Exception as e:
        logger.critical(f"Database initialization failed: {str(e)}")
        sys.exit(1)
