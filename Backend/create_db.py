import logging
from sqlalchemy import inspect
from app import create_app, db
from app.models import User, OrgProfile, OrgInitiatives, OrgProjects, SkillsNeeded, FocusArea, SocialMediaLink

# Set up logging
logging.basicConfig(level=logging.INFO)
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
    try:
        with app.app_context():
            logger.info("Starting database initialization...")
            
            # Create all tables
            db.create_all()
            logger.info("Database tables created successfully.")
            
            # Verify tables using inspector
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            logger.info(f"Created tables: {', '.join(tables)}")
            
            # Additional verification
            logger.info("Verifying key tables...")
            expected_tables = ['user', 'org_profile', 'org_initiatives', 'org_projects', 
                                'skills_needed', 'focus_area', 'social_media_link']
            missing_tables = [table for table in expected_tables if table not in tables]
            
            if missing_tables:
                logger.warning(f"Missing tables: {', '.join(missing_tables)}")
            else:
                logger.info("All expected tables are present.")
            
            return True
            
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise e

if __name__ == "__main__":
    reset_db()