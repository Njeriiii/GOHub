import unittest
from faker import Faker

from app import db, app
from app.models import (
    User,
    OrgProfile,
    OrgInitiatives,
    OrgProjects,
    SkillsNeeded,
)

from sqlalchemy import create_engine, exc
from sqlalchemy.orm import Session

# Initialize the Faker instance for generating random data.
fake = Faker()


class TestModels(unittest.TestCase):

    def setUp(self):
        # Create an SQLAlchemy engine for testing with an in-memory SQLite database.
        self.engine = create_engine("sqlite:///:memory:")

        # Create a session for testing.
        self.session = Session(self.engine)

        # Create tables in the testing database.
        db.Model.metadata.create_all(self.engine)

        # Initialize the Faker instance for generating random data.
        self.fake = Faker()

    def tearDown(self):
        # Roll back any changes made during the test.
        self.session.rollback()

        # Close the session.
        self.session.close()

    print("You are in the create_org_profile route")

    def test_user_creation(self):
        fake = self.fake  # Access the Faker instance from setUp

        # 1. Generate test data
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = fake.email()
        password = "test_password"  # For simplicity in testing

        # 2. Create a user object
        new_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,  # Your model likely has password hashing - adjust accordingly
        )

        # 3. Add and commit to the database
        db.session.add(new_user)
        db.session.commit()

        # 4. Query and validate
        retrieved_user = User.query.filter_by(email=email).first()
        self.assertIsNotNone(retrieved_user)  # Ensure the user was created
        self.assertEqual(retrieved_user.first_name, first_name)
        self.assertEqual(retrieved_user.email, email)
        # ... Additional assertions (e.g., check if password is correctly handled)

    # def test_org_profile_with_skills(self):
    #     # ... (Test code as before)

    # # Add more test cases for other models and their relationships


if __name__ == "__main__":
    unittest.main()
