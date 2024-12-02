from flask import Blueprint, jsonify, request
import requests

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
            "skills_needed": [skill.serialize() for skill in org.skills_needed],
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
    

# Add this new route to your existing Flask app
@main.route('/main/translate', methods=['POST'])
def translate_text():

    if request.method == "OPTIONS":
        # Explicitly handle OPTIONS request
        return jsonify({"status": "ok"}), 200

    data = request.json
    text = data.get('text')
    target_language = data.get('target_language', 'sw')
    
    # MyMemory API endpoint
    MYMEMORY_URL = "https://api.mymemory.translated.net/get"
    
    try:
        # Call MyMemory API
        params = {
            "q": text,
            "langpair": f"en|{target_language}",
            # Optional: Add your email for higher usage limits
            # "de": "your.email@example.com"
        }
        
        response = requests.get(MYMEMORY_URL, params=params)
        
        if response.status_code == 200:
            translation = response.json()
            return jsonify({
                'original_text': text,
                'translated_text': translation['responseData']['translatedText']
            })
        else:
            return jsonify({'error': 'Translation failed'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
