from app import create_app, db
from app.models import User, OrgProfile, OrgInitiatives, OrgProjects, SkillsNeeded, FocusArea, SocialMediaLink

app = create_app()

def reset_db():
    with app.app_context():
        # Drop all tables
        db.drop_all()
        
        # Create all tables
        db.create_all()
        
        print("Database tables created.")

if __name__ == "__main__":
    reset_db()