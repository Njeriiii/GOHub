from flask import Blueprint, jsonify, request

from app import db

from app.models import (
    User,
    SkillsNeeded,
    org_skills_connection,
    OrgProfile,
)

main = Blueprint("main", __name__)


# Get all organisations
@main.route("/main/orgs", methods=["GET"])
def get_all_orgs():

    orgs = OrgProfile.query.all()

    # Get the name and org overview of each organisation
    orgs_data = []
    for org in orgs:
        org_data = {
            "id": org.id,
            "user_id": org.user_id,
            "org_name": org.org_name,
            "org_overview": org.org_overview,
            "focus_areas": [focus_area.serialize() for focus_area in org.focus_areas],
        }

        orgs_data.append(org_data)

    return jsonify(orgs_data), 200


@main.route("/main/match-skills", methods=["GET"])
def match_volunteer_skills():
    
    user_id = request.args.get("user_id")
    
    if not user_id:
        return jsonify({"message": "User ID is required"}), 400
    
    try:
        volunteer = User.query.get(user_id)
        if not volunteer:
            return jsonify({"message": "Volunteer not found"}), 404
        
        # Get the volunteer's skills
        volunteer_skills = set(skill.id for skill in volunteer.skills)
        
        # Query for organizations that need any of the volunteer's skills
        matching_orgs = (
            OrgProfile.query.join(org_skills_connection)
            .join(SkillsNeeded)
            .filter(SkillsNeeded.id.in_(volunteer_skills))
            .distinct()
            .all()
        )

        # Prepare the response data
        org_matches = []
        for org in matching_orgs:
            
            org_matches.append(
                {
                    "org_id": org.id,
                    "org_name": org.org_name,
                    "user_id": org.user_id,
                    "focus_areas": [focus_area.serialize() for focus_area in org.focus_areas],
                    # "matching_skills": matching_skills,
                }
            )
        
        return (
            jsonify(
                {"message": "Matching organizations found", "matches": org_matches}
            ),
            200,
        )
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500