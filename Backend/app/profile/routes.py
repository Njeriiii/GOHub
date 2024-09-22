from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy.orm.exc import NoResultFound
from app.models import User, SkillsNeeded


from app import db

from app.models import (
    OrgProfile,
    OrgInitiatives,
    OrgProjects,
    SkillsNeeded,
    FocusArea,
    SocialMediaLink,
    org_skills_connection,
)

profile = Blueprint("profile", __name__)


# Create a new organisation profile
@profile.route("/profile/org", methods=["POST"])
def create_org_profile():

    response_data = {}
    data = request.get_json()

    # Extract data from the request
    user_id = data.get("user_id")
    org_details = data.get("Organization Details", {})
    contact_info = data.get("Contact Info", {})
    org_address = data.get("Address", {})
    additional_details = data.get("Additional Details", {})
    social_media = data.get("Social Media", {})

    # Create new OrgProfile instance
    new_org_profile = OrgProfile(
        user_id=user_id,
        org_name=org_details.get("orgName"),
        org_overview=org_details.get("aboutOrg"),
        org_mission_statement=data.get("Mission Statement"),
        org_logo=data.get("orgLogo"),
        org_cover_photo=data.get("coverImage"),
        org_email=contact_info.get("email"),
        org_phone=contact_info.get("phone"),
        org_district_town=org_address.get("districtTown"),
        org_county=org_address.get("county"),
        org_po_box=org_address.get("poBox"),
        org_country=org_address.get("country"),
        org_website=social_media.get("website"),
        org_registration_number=additional_details.get("org_registration_number"),
        org_year_established=additional_details.get("org_year_established"),
    )

    # Add and commit the new profile to the database
    db.session.add(new_org_profile)
    db.session.commit()

    # Handle focus areas
    focus_areas = additional_details.get("focus_areas", [])
    for area in focus_areas:
        focus_area = FocusArea.query.filter_by(name=area).first()
        if not focus_area:
            focus_area = FocusArea(name=area)
            db.session.add(focus_area)
        new_org_profile.focus_areas.append(focus_area)

    # Handle social media links - TODO - fix this 
    social_media = social_media.get("socialMedia", [])
    for link in social_media:

        # // remove website
        if link.get("platform") == "website":
            continue
        new_link = SocialMediaLink(
            org_id=new_org_profile.id,
            platform=link.get("platform"),
            url=link.get("url")
        )
        db.session.add(new_link)

    db.session.commit()

    response_data["message"] = "Organisation profile created successfully"
    response_data["status"] = "success"
    response_data["org_id"] = new_org_profile.id

    return jsonify(response_data), 201


# Store an organisations projects and initiatives
@profile.route("/profile/org/projects_initiatives", methods=["POST"])
def store_org_projects_initiatives():

    response_data = {}
    data = request.get_json()

    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"status": "failed", "message": "User ID is required"}), 400
    
    # Check if the user is an admin
    user = User.query.get(user_id)
    if not user:
        return jsonify({"status": "failed", "message": "User not found"}), 404
    
    if not user.is_admin:
        return jsonify({"status": "failed", "message": "Only admin users can create an organisation profile"}), 403
    
    org_profile = OrgProfile.query.filter_by(user_id=user_id).first()
    if not org_profile:
        return jsonify({"status": "failed", "message": "Organisation not found"}), 404
    
    org_id = org_profile.id

    # Get the organisation id
    if not org_id:
        return jsonify({"status": "failed", "message": "Organization ID is required"}), 400

    org_initiatives = data.get("Programs & Initiatives")
    ongoing_projects = data.get("Ongoing Projects")
    previous_projects = data.get("Previous Projects")
    support_needs = data.get("Support Needs")

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

    for need_data in support_needs["nonTechSkills"]:
        # check if need is in the database
        # if not add it
        # if it is, get the id and add it to the skillsneeded table

        need = need_data["value"]

        skill_description = need_data["description"]
        skill = SkillsNeeded.query.filter_by(skill=need).first()

        if skill is None:
            new_skill = SkillsNeeded(skill=need, status="non-tech")
            db.session.add(new_skill)
            db.session.commit()
            skill = SkillsNeeded.query.filter_by(skill=need).first()

        # append the skill to the org_skills_connection table
        new_need = SkillsNeeded.query.filter_by(skill=need).first()

        new_association = org_skills_connection.insert().values(
                    org_id=org_id,
                    skill_id=new_need.id,
                    description=skill_description
                )
        db.session.execute(new_association)


    for need_data in support_needs["techSkills"]:
        # check if need is in the database
        # if not add it
        # if it is, get the id and add it to the skillsneeded table
        need = need_data["value"]
        skill_description = need_data["description"]
        skill = SkillsNeeded.query.filter_by(skill=need).first()

        if skill is None:
            new_skill = SkillsNeeded(skill=need, status="tech")
            db.session.add(new_skill)
            db.session.commit()
            skill = SkillsNeeded.query.filter_by(skill=need).first()

        # append the skill to the org_skills_connection table
        new_need = SkillsNeeded.query.filter_by(skill=need).first()
        new_association = org_skills_connection.insert().values(
                    org_id=org_id,
                    skill_id=new_need.id,
                    description=skill_description
                )
        db.session.execute(new_association)

    db.session.commit()

    response_data["message"] = (
        "Organisation projects and initiatives stored successfully"
    )
    response_data["status"] = "success"

    return jsonify(response_data), 201


# Load an organisation's profile
@profile.route("/profile/load_org", methods=["GET"])
def load_org_profile():

    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"message": "User ID is required"}), 400

    response_data = {}

    org_profile = OrgProfile.query.filter_by(user_id=user_id).first()

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

    response_data = {}

    skills = SkillsNeeded.query.all()

    skills_data = [skill.serialize() for skill in skills]

    response_data["skills"] = skills_data
    response_data["status"] = "success"

    return jsonify(response_data), 200


@profile.route("/profile/volunteer", methods=["POST"])
def create_volunteer_profile():
    data = request.get_json()
    
    # Get user_id from the request data
    user_id = data.get('userId')

    if not user_id:
        return jsonify({"message": "User ID is required"}), 400

    try:
        user = User.query.filter_by(id=user_id).one()
    except NoResultFound:
        return jsonify({"message": "User not found"}), 404

    if user.is_admin:
        return jsonify({"message": "Admin users cannot create a volunteer profile"}), 403

    non_tech_skills = data.get("nonTechSkills", [])
    tech_skills = data.get("techSkills", [])

    for skill in non_tech_skills:
        skill_obj = SkillsNeeded.query.filter_by(skill=skill).first()
        if not skill_obj:
            skill_obj = SkillsNeeded(skill=skill, status="non-tech")
            db.session.add(skill_obj)
        user.skills.append(skill_obj)

    for skill in tech_skills:
        skill_obj = SkillsNeeded.query.filter_by(skill=skill).first()
        if not skill_obj:
            skill_obj = SkillsNeeded(skill=skill, status="tech")
            db.session.add(skill_obj)
        user.skills.append(skill_obj)

    try:
        db.session.commit()
        return jsonify({
            "message": "Volunteer profile updated successfully",
            "user": user.serialize()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@profile.route("/profile/volunteer", methods=["GET"])
# @login_required
def get_volunteer_profile():

    user_id = request.args.get("user_id")
    
    if not user_id:
        return jsonify({"message": "User ID is required"}), 400

    try:
        volunteer = User.query.get(user_id)
        if not volunteer:
            return jsonify({"message": "Volunteer not found"}), 404
        
        return jsonify({
            "message": "Volunteer found",
            "volunteer": volunteer.serialize(),
        }), 200

    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@profile.route("/profile/volunteer/skills", methods=["GET"])
def get_all_skills():
    skills = SkillsNeeded.query.all()
    return jsonify([skill.serialize() for skill in skills]), 200