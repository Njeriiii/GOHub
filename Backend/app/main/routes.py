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
        print('org:', org)
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
    print("You are in the match_volunteer_skills route")
    print('request.args:', request.args)
    
    user_id = request.args.get("user_id")
    print('user_id:', user_id)
    
    if not user_id:
        return jsonify({"message": "User ID is required"}), 400
    
    try:
        volunteer = User.query.get(user_id)
        if not volunteer:
            return jsonify({"message": "Volunteer not found"}), 404
        
        # Get the volunteer's skills
        volunteer_skills = set(skill.id for skill in volunteer.skills)
        print('volunteer_skills:', volunteer_skills)
        
        # Query for organizations that need any of the volunteer's skills
        matching_orgs = (
            OrgProfile.query.join(org_skills_connection)
            .join(SkillsNeeded)
            .filter(SkillsNeeded.id.in_(volunteer_skills))
            .distinct()
            .all()
        )
        print('matching_orgs:', matching_orgs)
        
        # Prepare the response data
        org_matches = []
        for org in matching_orgs:
            # matching_skills = [
            #     {
            #         "skill_id": skill.id,
            #         "skill_name": skill.skill_name,
            #         "description": org_skills_connection.c.description,
            #     }
            #     for skill in org.skills_needed
            #     if skill.id in volunteer_skills
            # ]
            
            org_matches.append(
                {
                    "org_id": org.id,
                    "org_name": org.org_name,
                    "user_id": org.user_id,
                    "focus_areas": [focus_area.serialize() for focus_area in org.focus_areas],
                    # "matching_skills": matching_skills,
                }
            )
        
        print('org_matches:', org_matches)
        return (
            jsonify(
                {"message": "Matching organizations found", "matches": org_matches}
            ),
            200,
        )
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500