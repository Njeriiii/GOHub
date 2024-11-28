from app import db
from datetime import datetime, timezone
import enum

# Association table for User (volunteer) skills
user_skills = db.Table('user_skills',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('skill_id', db.Integer, db.ForeignKey('skills_needed.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(200), nullable=False)
    last_name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    last_login = db.Column(db.DateTime)

    # Relationship with OrgProfile
    org_profile = db.relationship(
        "OrgProfile", backref="admin", lazy=True, uselist=False
    )

    # Relationship with skills (for volunteers)
    skills = db.relationship('SkillsNeeded', secondary=user_skills, lazy='subquery',
        backref=db.backref('volunteers', lazy=True))

    def __repr__(self):
        return f"{self.first_name} {self.last_name}"

    def serialize(self):

        user_data = {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "is_admin": self.is_admin,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_login": self.last_login.isoformat() if self.last_login else None,
            "skills": [skill.serialize() for skill in self.skills] if not self.is_admin else None,
        }

        return user_data


# Define the Connections table
org_skills_connection = db.Table(
    "org_skills",
    db.Column("org_id", db.Integer, db.ForeignKey("org_profile.id"), primary_key=True),
    db.Column(
        "skill_id", db.Integer, db.ForeignKey("skills_needed.id"), primary_key=True
    ),
    # add a description column to the association table
    db.Column("description", db.Text, nullable=True)
)

# Define the Focus Areas table
org_focus_areas = db.Table(
    "org_focus_areas",
    db.Column("org_id", db.Integer, db.ForeignKey("org_profile.id"), primary_key=True),
    db.Column(
        "focus_area_id", db.Integer, db.ForeignKey("focus_area.id"), primary_key=True
    ),
)


class OrgProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    org_name = db.Column(db.String(200), nullable=False)
    org_overview = db.Column(db.String(200), nullable=False)
    org_mission_statement = db.Column(db.Text, nullable=True)
    org_logo = db.Column(db.String(200), nullable=True)
    org_cover_photo = db.Column(db.String(200), nullable=True)
    org_email = db.Column(db.String(200), nullable=False)
    org_phone = db.Column(db.String(200), nullable=False)
    org_district_town = db.Column(db.String(200), nullable=False)
    org_county = db.Column(db.String(200), nullable=False)
    org_po_box = db.Column(db.String(200), nullable=False)
    org_country = db.Column(db.String(200), nullable=False)
    org_website = db.Column(db.String(200), nullable=True)
    org_registration_number = db.Column(db.String(200), nullable=True)
    org_year_established = db.Column(db.Integer, nullable=True)
    org_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
    )

    # 1 to many relationship org_profile to org_initiatives
    initiatives = db.relationship("OrgInitiatives", backref="org_profile", lazy=True)

    # 1 to many relationship org_profile to org_projects
    projects = db.relationship("OrgProjects", backref="org_profile", lazy=True)

    # Define a relationship to SkillsNeeded through the org_skills table
    skills_needed = db.relationship(
        "SkillsNeeded",
        secondary=org_skills_connection,
        # lazy="dynamic",
        back_populates="org_profiles",
        lazy=True,
    )

    focus_areas = db.relationship(
        "FocusArea", secondary=org_focus_areas, back_populates="org_profiles", lazy=True
    )
    social_media_links = db.relationship(
        "SocialMediaLink",
        backref="org_profile",
        lazy=True,
        cascade="all, delete-orphan",
    )

    # One-to-one relationship
    mpesa_config = db.relationship("MpesaConfig", uselist=False, backref="org_profile")

    def __repr__(self):
        return f"{self.org_name}"

    def serialize(self):

        org_data = {
            "id": self.id,
            "user_id": self.user_id,
            "org_name": self.org_name,
            "org_overview": self.org_overview,
            "org_mission_statement": self.org_mission_statement,
            "org_logo": self.org_logo,
            "org_cover_photo": self.org_cover_photo,
            "org_email": self.org_email,
            "org_phone": self.org_phone,
            "org_district_town": self.org_district_town,
            "org_county": self.org_county,
            "org_po_box": self.org_po_box,
            "org_country": self.org_country,
            "org_website": self.org_website,
            "org_registration_number": self.org_registration_number,
            "org_year_established": self.org_year_established,
            "org_verified": self.org_verified,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "skills_needed": [skill.serialize() for skill in self.skills_needed],
            "focus_areas": [area.serialize() for area in self.focus_areas],
            "social_media_links": [
                link.serialize() for link in self.social_media_links
            ],
            "mpesa_config": self.mpesa_config.serialize() if self.mpesa_config else None,
        }
        return org_data


class OrgInitiatives(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey("org_profile.id"), nullable=False)
    initiative_name = db.Column(db.String(200), nullable=False)
    initiative_description = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"{self.initiative_name}"

    def serialize(self):

        initiative_data = {
            "id": self.id,
            "org_id": self.org_id,
            "initiative_name": self.initiative_name,
            "initiative_description": self.initiative_description,
        }
        return initiative_data


class OrgProjects(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey("org_profile.id"), nullable=False)
    project_name = db.Column(db.String(200), nullable=False)
    project_description = db.Column(db.String(200), nullable=False)

    # project status: ongoing, completed, upcoming
    project_status = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"{self.project_name}"

    def serialize(self):

        project_data = {
            "id": self.id,
            "org_id": self.org_id,
            "project_name": self.project_name,
            "project_description": self.project_description,
            "project_status": self.project_status,
        }

        return project_data


class SkillsNeeded(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    skill = db.Column(db.String(200), nullable=False)

    # status: tech, non-tech
    status = db.Column(db.String(200), nullable=False)

    # many to many relationship skills to organisations
    org_profiles = db.relationship(
        "OrgProfile",  # The name of the Parent model
        secondary=org_skills_connection,  # The name of the association table
        # lazy="dynamic",
        back_populates="skills_needed",
        lazy=True,
    )  # The name of the relationship from the parent model

    def __repr__(self):
        return f"{self.skill}"

    def serialize(self):
        skill_data = {
            "id": self.id,
            "skill": self.skill,
            "status": self.status,
        }
        return skill_data


class FocusArea(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)

    org_profiles = db.relationship(
        "OrgProfile", secondary=org_focus_areas, back_populates="focus_areas", lazy=True
    )

    def __repr__(self):
        return f"{self.name}"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
        }


class SocialMediaLink(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey("org_profile.id"), nullable=False)
    platform = db.Column(db.String(200), nullable=False)
    url = db.Column(db.String(500), nullable=False)

    def __repr__(self):
        return f"{self.platform}: {self.url}"

    def serialize(self):
        return {
            "id": self.id,
            "org_id": self.org_id,
            "platform": self.platform,
            "url": self.url,
        }

class PaymentType(enum.Enum):
    PAYBILL = "PB"
    SEND_MONEY = "SM"

class MpesaConfig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    org_profile_id = db.Column(db.Integer, db.ForeignKey("org_profile.id"), unique=True, nullable=False)

    merchant_name = db.Column(db.String(255), nullable=False)  # M-PESA merchant name
    payment_type = db.Column(db.Enum(PaymentType), nullable=False)
    
    # This will store either the paybill number or phone number depending on payment_type
    identifier = db.Column(db.String(50), nullable=False)  
    
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    

    def __repr__(self):
        return f"<MpesaConfig(merchant_name='{self.merchant_name}', payment_type='{self.payment_type.value}', identifier='{self.identifier}')>"

    def serialize(self):
        return {
            "id": self.id,
            "org_profile_id": self.org_profile_id,
            "merchant_name": self.merchant_name,
            "payment_type": self.payment_type.value,
            "identifier": self.identifier,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }