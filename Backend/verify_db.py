import logging
from sqlalchemy import inspect
from app import create_app, db
from sqlalchemy.sql import text

app = create_app()
logger = logging.getLogger(__name__)

def verify_db():
    with app.app_context():
        # Verify connection using session
        try:
            logger.info("Verifying database connection...")
            result = db.session.execute(text("SELECT 1"))
            result.scalar()
            db.session.commit()
            logger.info("Database connection verified")
        except Exception as e:
            logger.error(f"Database connection failed: {str(e)}")
            db.session.rollback()
            raise

        # Verify tables exist
        try:
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            logger.info(f"Existing tables: {', '.join(tables)}")
        except Exception as e:
            logger.error(f"Table inspection failed: {str(e)}")
            raise

if __name__ == "__main__":
    verify_db()