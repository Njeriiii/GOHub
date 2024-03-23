from flask import Blueprint, jsonify, request

from app import db

from app.models import (
    User,
    OrgProfile,
    OrgInitiatives,
    OrgProjects,
    SkillsNeeded,
)

profile = Blueprint("profile", __name__)


# Create a new organisation profile
@profile.route("/profile/org", methods=["POST"])
def create_org_profile():

    print("You are in the create_org_profile route")

    response_data = {}
    data = request.get_json()

    org_adminDetails = data.get("adminDetails")
    orgDetails = data.get("orgDetails")
    org_contactInfo = data.get("contactInfo")
    org_Address = data.get("orgAddress")
    orgLogo = data.get("orgLogo")
    org_coverImage = data.get("coverImage")
    org_missionStatement = data.get("missionStatement")

    new_org_profile = OrgProfile(
        admin_name=org_adminDetails["name"],
        admin_role=org_adminDetails["role"],
        admin_email=org_adminDetails["email"],
        org_name=orgDetails["orgName"],
        org_overview=orgDetails["aboutOrg"],
        org_mission_statement=org_missionStatement,
        org_email=org_contactInfo["email"],
        org_phone=org_contactInfo["phone"],
        org_district_town=org_Address["districtTown"],
        org_county=org_Address["county"],
        org_po_box=org_Address["poBox"],
        org_country=org_Address["country"],
        org_logo=orgLogo,
        org_cover_photo=org_coverImage,
    )

    db.session.add(new_org_profile)
    db.session.commit()

    response_data["message"] = "Organisation profile created successfully"
    response_data["status"] = "success"

    return jsonify(response_data), 201


# Store an organisations projects and initiatives
@profile.route("/profile/org/projects_initiatives", methods=["POST"])
def store_org_projects_initiatives():

    print("You are in the store_org_projects_initiatives route")

    response_data = {}
    data = request.get_json()

    # Get the organisation id from the admin email
    admin_details = data.get("adminDetails")
    admin_email = admin_details["email"]
    org_profile = OrgProfile.query.filter_by(admin_email=admin_email).first()
    org_id = org_profile.id

    org_initiatives = data.get("programInitiatives")
    ongoing_projects = data.get("ongoingProjects")
    previous_projects = data.get("previousProjects")
    support_needs = data.get("supportNeeds")

    for project in ongoing_projects:
        new_project = OrgProjects(
            org_id=org_id,
            project_name=project["projectName"],
            project_description=project["description"],
            project_status="ongoing",
        )

        db.session.add(new_project)

    for project in previous_projects:
        new_project = OrgProjects(
            org_id=org_id,
            project_name=project["projectName"],
            project_description=project["description"],
            project_status="completed",
        )

        db.session.add(new_project)

    for initiative in org_initiatives:
        new_initiative = OrgInitiatives(
            org_id=org_id,
            initiative_name=initiative["initiativeName"],
            initiative_description=initiative["description"],
        )
        db.session.add(new_initiative)

    for need in support_needs["nonTechSkills"]:
        # check if need is in the database
        # if not add it
        # if it is, get the id and add it to the skillsneeded table

        need = need["value"]
        skill = SkillsNeeded.query.filter_by(skill=need).first()

        if skill is None:
            new_skill = SkillsNeeded(skill=need, status="non-tech")
            db.session.add(new_skill)
            db.session.commit()
            skill = SkillsNeeded.query.filter_by(skill=need).first()

        # append the skill to the org_skills_connection table
        new_need = SkillsNeeded.query.filter_by(skill=need).first()
        new_need.org_profiles.append(org_profile)

        db.session.add(new_need)

    for need in support_needs["techSkills"]:
        # check if need is in the database
        # if not add it
        # if it is, get the id and add it to the skillsneeded table
        need = need["value"]
        skill = SkillsNeeded.query.filter_by(skill=need).first()

        if skill is None:
            new_skill = SkillsNeeded(skill=need, status="tech")
            db.session.add(new_skill)
            db.session.commit()
            skill = SkillsNeeded.query.filter_by(skill=need).first()

        # append the skill to the org_skills_connection table
        new_need = SkillsNeeded.query.filter_by(skill=need).first()
        new_need.org_profiles.append(org_profile)

        db.session.add(new_need)

    db.session.commit()

    response_data["message"] = (
        "Organisation projects and initiatives stored successfully"
    )
    response_data["status"] = "success"

    return jsonify(response_data), 201


# Load an organisation's profile
@profile.route("/profile/org/<string:email>", methods=["GET"])
def load_org_profile(email):

    print("You are in the load_org_profile route")

    response_data = {}

    org_profile = OrgProfile.query.filter_by(admin_email=email).first()

    if org_profile is None:
        response_data["message"] = "Organisation profile not found"
        response_data["status"] = "failed"
        return jsonify(response_data), 404

    org_id = org_profile.id

    org_profile_data = org_profile.serialize()
    org_projects = OrgProjects.query.filter_by(org_id=org_id).all()
    org_initiatives = OrgInitiatives.query.filter_by(org_id=org_id).all()

    org_skills_needed = SkillsNeeded.query.filter(
        SkillsNeeded.org_profiles.any(id=org_id)
    ).all()

    response_data["orgProfile"] = org_profile_data
    response_data["orgProfile"] = org_profile.serialize()
    response_data["orgProjects"] = [project.serialize() for project in org_projects]
    response_data["orgInitiatives"] = [
        initiative.serialize() for initiative in org_initiatives
    ]
    response_data["orgSkillsNeeded"] = [
        skill.serialize() for skill in org_skills_needed
    ]

    response_data["status"] = "success"

    return jsonify(response_data), 200


# Load all skills
@profile.route("/all_skills", methods=["GET"])
def load_all_skills():

    print("You are in the load_all_skills route")

    response_data = {}

    skills = SkillsNeeded.query.all()

    skills_data = [skill.serialize() for skill in skills]

    response_data["skills"] = skills_data
    response_data["status"] = "success"

    return jsonify(response_data), 200
