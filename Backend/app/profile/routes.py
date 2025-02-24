import logging
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload
from datetime import datetime, timezone
from app import db
from app.utils.image_handler import ImageHandler
from google.cloud import storage
import os

from app.models import (
    User,
    OrgProfile,
    OrgInitiatives,
    OrgProjects,
    SkillsNeeded,
    FocusArea,
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
    social_media = data.get("Social Media", {})

    # Create new OrgProfile instance
    new_org_profile = OrgProfile(
        user_id=user_id,
        org_name=org_details.get("orgName"),
        org_overview=org_details.get("aboutOrg"),
        org_registration_number=org_details.get("orgRegistrationNumber"),
        org_year_established=org_details.get("orgYearEstablished"),
        org_mission_statement=data.get("Mission Statement"),
        # org_logo=data.get("orgLogo"),
        # org_cover_photo=data.get("coverImage"),
        org_email=contact_info.get("email"),
        org_phone=contact_info.get("phone"),
        org_district_town=org_address.get("districtTown"),
        org_county=org_address.get("county"),
        org_po_box=org_address.get("poBox"),
        org_country=org_address.get("country"),
        org_physical_description=org_address.get("physicalDescription"),
        org_google_maps_link=org_address.get("googleMapsLink"),
        org_website=social_media.get("website"),
        org_facebook=social_media.get("facebook"),
        org_instagram=social_media.get("instagram"),
        org_linkedin=social_media.get("linkedin"),
        org_youtube=social_media.get("youtube"),
        org_x=social_media.get("x"),
    )

    # Add and commit the new profile to the database
    db.session.add(new_org_profile)
    db.session.commit()

    # Handle focus areas
    focus_areas = org_details.get("focusAreas", [])
    for area in focus_areas:
        focus_area = FocusArea.query.filter_by(name=area).first()
        if not focus_area:
            focus_area = FocusArea(name=area)
            db.session.add(focus_area)
        new_org_profile.focus_areas.append(focus_area)

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

    org_profile = OrgProfile.query.filter_by(user_id=user_id).first()

    if org_profile is None:
        return jsonify({
            "message": "Organisation profile not found",
            "status": "failed"
        }), 404

    # Get all data from the serialized org profile
    serialized_data = org_profile.serialize()
    
    response_data = {
        "orgProfile": serialized_data,  # This now includes skills with descriptions
        "orgProjects": [project.serialize() for project in org_profile.projects],
        "orgInitiatives": [initiative.serialize() for initiative in org_profile.initiatives],
        "status": "success"
    }

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
        
        if volunteer.is_admin:
            return jsonify({"message": "Admin users cannot be volunteers"}), 403
        
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


@profile.route("/profile/volunteer/edit", methods=["POST"])
def edit_volunteer_profile():
    data = request.get_json()

    # Get user_id from the request data
    user_id = data.get("userId")

    if not user_id:
        return jsonify({"message": "User ID is required"}), 400

    try:
        user = User.query.filter_by(id=user_id).one()
    except NoResultFound:
        return jsonify({"message": "User not found"}), 404

    if user.is_admin:
        return (
            jsonify({"message": "Admin users cannot edit a volunteer profile"}),
            403,
        )

    # Get current skills
    current_tech_skills = {
        skill.skill for skill in user.skills if skill.status == "tech"
    }
    current_non_tech_skills = {
        skill.skill for skill in user.skills if skill.status == "non-tech"
    }

    # Get skills to add and remove
    new_tech_skills = set(data.get("techSkills", []))
    new_non_tech_skills = set(data.get("nonTechSkills", []))

    try:
        # Handle tech skills changes
        tech_skills_to_add = new_tech_skills - current_tech_skills
        tech_skills_to_remove = current_tech_skills - new_tech_skills

        # Handle non-tech skills changes
        non_tech_skills_to_add = new_non_tech_skills - current_non_tech_skills
        non_tech_skills_to_remove = current_non_tech_skills - new_non_tech_skills

        # Remove skills that are no longer needed
        for skill in user.skills[
            :
        ]:  # Create a copy of the list to avoid modification during iteration
            if (skill.status == "tech" and skill.skill in tech_skills_to_remove) or (
                skill.status == "non-tech" and skill.skill in non_tech_skills_to_remove
            ):
                user.skills.remove(skill)

        # Add new tech skills
        for skill_name in tech_skills_to_add:
            skill_obj = SkillsNeeded.query.filter_by(skill=skill_name).first()
            if not skill_obj:
                skill_obj = SkillsNeeded(skill=skill_name, status="tech")
                db.session.add(skill_obj)
            user.skills.append(skill_obj)

        # Add new non-tech skills
        for skill_name in non_tech_skills_to_add:
            skill_obj = SkillsNeeded.query.filter_by(skill=skill_name).first()
            if not skill_obj:
                skill_obj = SkillsNeeded(skill=skill_name, status="non-tech")
                db.session.add(skill_obj)
            user.skills.append(skill_obj)

        db.session.commit()

        # Return summary of changes
        changes = {
            "added": {
                "tech": list(tech_skills_to_add),
                "non_tech": list(non_tech_skills_to_add),
            },
            "removed": {
                "tech": list(tech_skills_to_remove),
                "non_tech": list(non_tech_skills_to_remove),
            },
        }

        return (
            jsonify(
                {
                    "message": "Volunteer skills updated successfully",
                    "changes": changes,
                    "user": user.serialize(),
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


# Edit basic organization profile information
@profile.route("/profile/edit_basic_info", methods=["POST"])
def edit_org_profile():
    """Update organization profile information"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "No data provided"}), 400

        # Get user_id from the request data
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"status": "error", "message": "User ID is required"}), 400

        org_profile = OrgProfile.query.filter_by(user_id=user_id).first()
        if not org_profile:
            return jsonify({"status": "error", "message": "Organization profile not found"}), 404

        # Update fields that are present in the request
        updatable_fields = [
            'org_name', 'org_overview', 'org_mission_statement',
            'org_email', 'org_phone', 'org_district_town', 'org_county',
            'org_po_box', 'org_physical_description', 'org_google_maps_link',
            'org_website', 'org_facebook', 'org_x', 'org_instagram',
            'org_linkedin', 'org_youtube'
        ]

        for field in updatable_fields:
            if field in data:
                setattr(org_profile, field, data[field])

        org_profile.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Profile updated successfully"
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# Edit projects
@profile.route("/profile/edit_projects", methods=["POST"])
def edit_org_projects():
    """Update organization projects intelligently"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "No data provided"}), 400

        user_id = data[0].get('user_id')
        if not user_id:
            return jsonify({"status": "error", "message": "User ID is required"}), 400

        org_profile = OrgProfile.query.filter_by(user_id=user_id).first()
        if not org_profile:
            return jsonify({"status": "error", "message": "Organization profile not found"}), 404

        # Get existing projects
        existing_projects = OrgProjects.query.filter_by(org_id=org_profile.id).all()
        existing_projects_dict = {project.id: project for project in existing_projects}

        # Track which projects were updated
        updated_project_ids = set()

        # Update or create projects
        for project_data in data:
            project_id = project_data.get('id')
            
            if project_id and project_id in existing_projects_dict:
                # Update existing project
                project = existing_projects_dict[project_id]
                project.project_name = project_data['project_name']
                project.project_description = project_data['project_description']
                project.project_status = project_data['project_status']
                updated_project_ids.add(project_id)
            else:
                # Create new project
                new_project = OrgProjects(
                    org_id=org_profile.id,
                    project_name=project_data['project_name'],
                    project_description=project_data['project_description'],
                    project_status=project_data['project_status']
                )
                db.session.add(new_project)

        # Delete projects that weren't in the update
        projects_to_delete = [
            project for project_id, project in existing_projects_dict.items()
            if project_id not in updated_project_ids
        ]
        for project in projects_to_delete:
            db.session.delete(project)

        db.session.commit()
        return jsonify({
            "status": "success",
            "message": "Projects updated successfully"
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# Edit initiatives
@profile.route("/profile/edit_initiatives", methods=["POST"])
def edit_org_initiatives():
    """Update organization initiatives intelligently"""
    try:
        print("Starting request processing")  # Debug log
        data = request.get_json()
        print(f"Received data: {data}")  # Debug log
        
        if not data:
            print("No data received")  # Debug log
            return jsonify({"status": "error", "message": "Invalid data format"}), 400

        if not isinstance(data, list):
            print(f"Invalid data type: {type(data)}")  # Debug log
            return jsonify({"status": "error", "message": "Expected array of initiatives"}), 400

        initiatives = data
        if not initiatives:
            print("No initiatives in data")  # Debug log
            return jsonify({"status": "error", "message": "No initiatives provided"}), 400

        # Get user_id and org_id from first initiative
        first_initiative = initiatives[0]
        user_id = first_initiative.get('user_id')
        org_id = first_initiative.get('org_id')

        print(f"User ID: {user_id}, Org ID: {org_id}")  # Debug log

        if not user_id or not org_id:
            print("Missing user_id or org_id")  # Debug log
            return jsonify({"status": "error", "message": "User ID and Org ID are required"}), 400

        try:
            org_profile = OrgProfile.query.filter_by(id=org_id, user_id=user_id).first()
            print(f"Found org profile: {org_profile is not None}")  # Debug log
            
            if not org_profile:
                return jsonify({"status": "error", "message": "Organization profile not found"}), 404

            existing_initiatives = OrgInitiatives.query.filter_by(org_id=org_id).all()
            print(f"Found {len(existing_initiatives)} existing initiatives")  # Debug log
            
            existing_initiatives_dict = {init.id: init for init in existing_initiatives}
            updated_initiative_ids = set()

            # Start database transaction
            for initiative_data in initiatives:
                initiative_id = initiative_data.get('id')
                print(f"Processing initiative ID: {initiative_id}")  # Debug log

                if initiative_id and initiative_id in existing_initiatives_dict:
                    # Update existing initiative
                    initiative = existing_initiatives_dict[initiative_id]
                    initiative.initiative_name = initiative_data['initiative_name']
                    initiative.initiative_description = initiative_data['initiative_description']
                    updated_initiative_ids.add(initiative_id)
                else:
                    # Create new initiative
                    new_initiative = OrgInitiatives(
                        org_id=org_id,
                        initiative_name=initiative_data['initiative_name'],
                        initiative_description=initiative_data['initiative_description']
                    )
                    db.session.add(new_initiative)

            # Delete initiatives that weren't in the update
            for init_id, init in existing_initiatives_dict.items():
                if init_id not in updated_initiative_ids:
                    print(f"Deleting initiative ID: {init_id}")  # Debug log
                    db.session.delete(init)

            db.session.commit()
            print("Successfully committed changes")  # Debug log
            
            return jsonify({
                "status": "success",
                "message": "Initiatives updated successfully"
            }), 200

        except SQLAlchemyError as db_err:
            print(f"Database error: {str(db_err)}")  # Debug log
            db.session.rollback()
            raise

    except SQLAlchemyError as e:
        print(f"SQLAlchemy error: {str(e)}")  # Debug log
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 501
    except Exception as e:
        print(f"Unexpected error: {str(e)}")  # Debug log
        print(f"Error type: {type(e)}")  # Debug log
        return jsonify({"status": "error", "message": str(e)}), 502


@profile.route("/profile/edit_skills", methods=["POST"])
def edit_org_skills():
    """Update organization skills with support for add/remove/remains actions"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Invalid data format"}), 400

        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"status": "error", "message": "User ID is required"}), 400

        skills_list = [data[str(i)] for i in range(len(data) - 1)]
        print("Processing skills:", skills_list)

        org_profile = OrgProfile.query.filter_by(user_id=user_id).first()
        if not org_profile:
            return jsonify({"status": "error", "message": "Organization profile not found"}), 404

        # Simply empty the skills list without trying to delete from association table
        org_profile.skills_needed = []
        db.session.flush()

        # Add new skills
        for skill_item in skills_list:
            if skill_item.get('action') in ['add', 'remains']:
                # Get or create skill
                skill = SkillsNeeded.query.filter_by(
                    skill=skill_item['skill'],
                    status=skill_item['status']
                ).first()

                if not skill:
                    skill = SkillsNeeded(
                        skill=skill_item['skill'],
                        status=skill_item['status']
                    )
                    db.session.add(skill)
                    db.session.flush()

                # Add to relationship
                org_profile.skills_needed.append(skill)
                
                # Let SQLAlchemy create the association, then update the description
                db.session.flush()
                
                # Now update the description
                db.session.execute(
                    org_skills_connection.update().where(
                        db.and_(
                            org_skills_connection.c.org_id == org_profile.id,
                            org_skills_connection.c.skill_id == skill.id
                        )
                    ).values(
                        description=skill_item.get('description', '')
                    )
                )

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Skills updated successfully",
            "skills": [skill.serialize() for skill in org_profile.skills_needed]
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Database error: {str(e)}")
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500
    except Exception as e:
        db.session.rollback()
        print(f"Unexpected error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500


@profile.route("/profile/upload-images", methods=["POST"])
def upload_org_images():
    """
    Handle simultaneous upload of organization logo and cover photo
    Expected form data:
    - user_id: The current user's ID
    - org_id: The organization profile ID
    - logo: (optional) The logo file
    - cover_photo: (optional) The cover photo file

    Returns:
        tuple: (json_response, status_code)
        Response includes:
        - message: Status message
        - results: Dictionary containing upload results for each image type
        Status codes:
        - 200: All uploads successful
        - 207: Partial success (some uploads failed)
        - 400: Bad request (missing data or all uploads failed)
        - 403: Unauthorized access
        - 404: Organization not found
        - 500: Server error
    """
    try:
        # Get the current user's ID
        current_user_id = request.form.get("user_id")
        if not current_user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Get and validate org_id
        org_profile = OrgProfile.query.filter_by(user_id=current_user_id).first()
        if not org_profile:
            return jsonify({"error": "Organization profile not found"}), 404

        org_id = org_profile.id
        if not org_id:
            return jsonify({"error": "Organization ID is required"}), 400

        # Verify ownership
        logging.warning(
            f"User {current_user_id} attempting to upload images for org {org_id}"
        )
        logging.warning(f"Org profile user ID: {org_profile.user_id}")
        if int(org_profile.user_id) != int(current_user_id):
            logging.warning(
                f"Unauthorized image upload attempt for org {org_id} by user {current_user_id}"
            )
            return jsonify({"error": "Unauthorized access"}), 403

        # Validate that at least one file was provided
        if not any(request.files.get(type_) for type_ in ["logo", "cover_photo"]):
            return jsonify({"error": "No image files provided"}), 400

        # Initialize image handler
        image_handler = ImageHandler()

        # Track upload results for each image type
        results = {"logo": None, "cover_photo": None}

        # Handle both file uploads
        for image_type in ["logo", "cover_photo"]:
            if image_type in request.files:
                file = request.files[image_type]
                if file and file.filename:
                    try:
                        # Get the current filename for this image type
                        old_filename = (
                            org_profile.org_logo_filename
                            if image_type == "logo"
                            else org_profile.org_cover_photo_filename
                        )

                        # Delete old image if it exists
                        if old_filename:
                            logging.info(f"Deleting old {image_type}: {old_filename}")
                            image_handler.delete_image(old_filename)

                        # Upload new image
                        logging.info(f"Uploading new {image_type}: {file.filename}")
                        filename = image_handler.upload_image(file, image_type)

                        # Update database field
                        if image_type == "logo":
                            org_profile.org_logo_filename = filename
                        else:
                            org_profile.org_cover_photo_filename = filename

                        # Store result with public URL
                        bucket_name = os.getenv("GCS_BUCKET_NAME")
                        results[image_type] = {
                            "success": True,
                            "filename": filename,
                            "url": f"https://storage.googleapis.com/{bucket_name}/{filename}",
                        }
                        logging.info(f"Successfully uploaded {image_type}")

                    except ValueError as ve:
                        logging.error(f"Error uploading {image_type}: {str(ve)}")
                        results[image_type] = {"success": False, "error": str(ve)}

        # Update organization profile timestamp
        org_profile.updated_at = datetime.now(timezone.utc)

        # Commit changes to database
        try:
            db.session.commit()
            logging.info(f"Successfully updated org profile {org_id} with new images")
        except SQLAlchemyError as e:
            logging.error(f"Database error updating org profile {org_id}: {str(e)}")
            db.session.rollback()
            return jsonify({"error": "Failed to update database"}), 500

        # Prepare response with upload results
        response = {"message": "Image upload completed", "results": results}

        # Determine appropriate status code based on results
        if all(r and r.get("success") for r in results.values() if r):
            status_code = 200  # All uploads successful
        elif any(r and r.get("success") for r in results.values() if r):
            status_code = 207  # Partial success
        else:
            status_code = 400  # All uploads failed

        return jsonify(response), status_code

    except Exception as e:
        logging.error(f"Unexpected error in upload_org_images: {str(e)}")
        db.session.rollback()
        return (
            jsonify(
                {
                    "error": "Internal server error",
                    "message": "An unexpected error occurred while processing the upload",
                }
            ),
            500,
        )


@profile.route("/api/test/gcs", methods=["GET"])
def test_gcs_connection():
    """Test GCS connectivity and operations. Only available in development."""
    if os.getenv("ENV") != "development":
        return jsonify({"error": "Test endpoint only available in development"}), 403

    results = {
        "connection": False,
        "bucket_access": False,
        "list_files": False,
        "test_upload": False,
        "details": {},
    }

    try:
        # Test 1: Basic connection
        storage_client = storage.Client()
        results["connection"] = True
        results["details"]["project"] = storage_client.project

        # Test 2: Bucket access
        bucket_name = os.getenv("GCS_BUCKET_NAME")
        bucket = storage_client.bucket(bucket_name)
        results["bucket_access"] = True
        results["details"]["bucket_name"] = bucket_name

        # Test 3: List files
        blobs = list(bucket.list_blobs(max_results=5))
        results["list_files"] = True
        results["details"]["files"] = [
            {"name": blob.name, "size": blob.size, "updated": blob.updated.isoformat()}
            for blob in blobs
        ]

        # Test 4: Test upload
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_blob = bucket.blob(f"test/gcs_test_{timestamp}.txt")
        test_blob.upload_from_string(
            "GCS Test at " + datetime.now().isoformat(), content_type="text/plain"
        )
        results["test_upload"] = True
        results["details"]["test_file"] = {
            "name": test_blob.name,
            "url": f"https://storage.googleapis.com/{bucket_name}/{test_blob.name}",
        }

        # Add credentials info
        creds_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
        results["details"]["credentials_path"] = (
            creds_path if creds_path else "Using default credentials"
        )

        return jsonify(
            {"success": True, "message": "All GCS tests passed", "results": results}
        )

    except Exception as e:
        results["error"] = str(e)
        return (
            jsonify(
                {"success": False, "message": "GCS test failed", "results": results}
            ),
            500,
        )
