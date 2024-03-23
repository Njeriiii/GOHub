from app import db, login_manager


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(200), nullable=False)
    last_name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"{self.first_name} {self.last_name}"

    def serialize(self):

        user_data = {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
        }

        return user_data


# Define the Connections table
org_skills_connection = db.Table(
    "org_skills",
    db.Column("org_id", db.Integer, db.ForeignKey("org_profile.id"), primary_key=True),
    db.Column(
        "skill_id", db.Integer, db.ForeignKey("skills_needed.id"), primary_key=True
    ),
)


class OrgProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admin_name = db.Column(db.String(200), nullable=False)
    admin_role = db.Column(db.String(200), nullable=False)
    admin_email = db.Column(db.String(200), nullable=False)
    org_name = db.Column(db.String(200), nullable=False)
    org_overview = db.Column(db.String(200), nullable=False)
    # org_website = db.Column(db.String(200), nullable=False)
    org_mission_statement = db.Column(db.String(200), nullable=True)
    # An image in png/jpeg format
    org_logo = db.Column(db.String(200), nullable=True)
    org_cover_photo = db.Column(db.String(200), nullable=True)
    org_email = db.Column(db.String(200), nullable=False)
    org_phone = db.Column(db.String(200), nullable=False)
    org_district_town = db.Column(db.String(200), nullable=False)
    org_county = db.Column(db.String(200), nullable=False)
    org_po_box = db.Column(db.String(200), nullable=False)
    org_country = db.Column(db.String(200), nullable=False)

    # TODO: Add a column for the organisation's website
    # TODO: Add a column for the organisation's primary area of focus

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

    def __repr__(self):
        return f"{self.org_name}"

    def serialize(self):

        org_data = {
            "id": self.id,
            "admin_name": self.admin_name,
            "admin_role": self.admin_role,
            "admin_email": self.admin_email,
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
            "skills_needed": [skill.serialize() for skill in self.skills_needed],
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
        skill_data = {"id": self.id, "skill": self.skill, "status": self.status}
        return skill_data
