from flask import Blueprint, jsonify, request
from google.cloud import translate_v2 as translate
import os
import json
from google.oauth2 import service_account
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
    


# Initialize the client with your Google Cloud API key
# os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/flawless-snow-443501-q3-85e4441a1dd7.json'

# # If using environment variable
# if 'GOOGLE_CREDENTIALS' in os.environ:
#     # Create credentials from JSON string
#     credentials_info = json.loads(os.getenv['GOOGLE_CREDENTIALS'])
#     credentials = service_account.Credentials.from_service_account_info(credentials_info)
#     translate_client = translate.Client(credentials=credentials)
# else:
#     # Fall back to file-based credentials
    # translate_client = translate.Client()

@main.route('/main/translate', methods=['POST', 'OPTIONS'])
def translate_text():
    print("Received translation request")  # Debug log
    
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    
    return jsonify({"message": "Translation endpoint"}), 200
    
    # try:
    #     data = request.json
    #     print("Request data:", data)  # Debug log
        
    #     text = data.get('text')
    #     target_language = data.get('target_language', 'sw')
        
    #     if not text:
    #         return jsonify({'error': 'No text provided'}), 400

    #     print("Calling Google Translate API")  # Debug log
        
    #     # Call Google Translate
    #     result = translate_client.translate(
    #         text,
    #         target_language=target_language,
    #         source_language='en'
    #     )
        
    #     print("Translation result:", result)  # Debug log
        
    #     return jsonify({
    #         'original_text': text,
    #         'translated_text': result['translatedText']
    #     })
            
    # except Exception as e:
    #     print("Error:", str(e))  # Debug log
    #     return jsonify({'error': str(e)}), 500
