import logging
from app import create_app, db
from app.models import User, OrgProfile, OrgInitiatives, OrgProjects, SkillsNeeded, FocusArea, SocialMediaLink

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = create_app()

def reset_db():
    try:
        with app.app_context():
            logger.info("Starting database initialization...")
            
            # Create all tables
            db.create_all()
            logger.info("Database tables created successfully.")
            
            # Verify tables were created
            tables = db.engine.table_names()
            logger.info(f"Created tables: {', '.join(tables)}")
            
            return True
            
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise e

if __name__ == "__main__":
    reset_db()