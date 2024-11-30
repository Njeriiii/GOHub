import logging
from sqlalchemy import inspect
from app import create_app, db
from sqlalchemy import text

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = create_app()


def verify_db_connection():
    try:
        with app.app_context():
            db.session.execute(text('SELECT 1'))
            logger.info("Database connection successful")
            return True
    except Exception as e:
        logger.error(f"Database connection failed: {str(e)}")
        return False

def verify_table_columns(inspector, table_name, expected_columns):
    """Helper function to verify table columns"""
    existing_columns = [col['name'] for col in inspector.get_columns(table_name)]
    missing_columns = [col for col in expected_columns if col not in existing_columns]
    return missing_columns

def upgrade_db():
    try:
        with app.app_context():
            logger.info("Starting database upgrade...")
            
            # Verify connection
            if not verify_db_connection():
                raise Exception("Database connection failed")
            
            # Get current database state
            inspector = inspect(db.engine)
            existing_tables = inspector.get_table_names()
            logger.info(f"Current tables: {', '.join(existing_tables)}")
            
            # Get all expected tables from models
            model_tables = {model.__tablename__: model for model in db.Model.__subclasses__()}
            logger.info(f"Expected tables from models: {', '.join(model_tables.keys())}")
            
            # Create missing tables
            for table_name, model in model_tables.items():
                if table_name not in existing_tables:
                    logger.info(f"Creating table {table_name}...")
                    model.__table__.create(db.engine)
                    logger.info(f"Table {table_name} created successfully")
            
            # Verify all tables after creation
            inspector = inspect(db.engine)
            final_tables = inspector.get_table_names()
            missing_tables = [table for table in model_tables.keys() if table not in final_tables]
            
            if missing_tables:
                logger.error(f"Failed to create tables: {', '.join(missing_tables)}")
                raise Exception("Database upgrade incomplete - missing tables")
            
            logger.info("Database upgrade completed successfully")
            return True
            
    except Exception as e:
        logger.error(f"Error upgrading database: {str(e)}")
        raise e

if __name__ == "__main__":
    verify_db_connection()
    upgrade_db()