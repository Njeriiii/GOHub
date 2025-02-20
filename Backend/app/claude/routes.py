from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from anthropic import Anthropic, APIError
import httpx
import os
import logging
import sys

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

claude = Blueprint("claude", __name__)

# Get API key
logger.info("Current directory: %s", os.getcwd())
logger.info("Python path: %s", sys.path)
logger.info("Environment variables: %s", 
    {k: v for k, v in os.environ.items() if 'KEY' in k or 'SECRET' in k or 'PASSWORD' in k})
api_key = os.environ.get('ANTHROPIC_API_KEY')
logger.info(f"API Key present: {bool(api_key)}")

try:
    client = httpx.Client()
    anthropic = Anthropic(
        api_key=api_key,
        http_client=client
    )
    logger.info("Anthropic client initialized successfully")
    logger.info(f"Anthropic client: {anthropic}")
    logger.info("Api key: " + api_key)
except Exception as e:
    logger.error(f"Failed to initialize Anthropic client: {str(e)}")
    anthropic = None

@claude.route('/claude/generate', methods=['POST'])
def generate_content():
    """
    Generate proposal content using Claude AI.
    """
    # Log request received
    logger.info("Received generation request")
    
    # Check API key first
    if not api_key:
        logger.error("No API key found")
        return jsonify({
            'error': 'API key not configured',
            'api_status': 'missing'
        }), 500

    # Check client initialization
    if not anthropic:
        logger.error("Anthropic client not initialized")
        return jsonify({
            'error': 'Anthropic client not initialized',
            'api_status': 'client_error'
        }), 500

    try:
        # Get and validate request data
        data = request.get_json()
        if not data:
            logger.error("No JSON data in request")
            return jsonify({'error': 'No JSON data provided'}), 400
            
        if 'prompt' not in data or 'section' not in data:
            logger.error(f"Missing required fields. Received fields: {data.keys()}")
            return jsonify({'error': 'Missing required fields: prompt and/or section'}), 400

        logger.info(f"Generating content for section: {data['section']}")
        
        try:
            # Generate content using Claude
            message = anthropic.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=1500,
                messages=[{
                    "role": "user",
                    "content": data['prompt']
                }],
                temperature=0.7,
            )
            
            if not message.content:
                logger.error("No content generated")
                return jsonify({
                    'error': 'Content generation failed',
                    'api_status': 'generation_error'
                }), 500

            generated_content = message.content[0].text
            logger.info("Content generated successfully")

            return jsonify({
                'content': generated_content,
                'status': 'success'
            }), 200

        except APIError as ae:
            logger.error(f"Anthropic API error: {str(ae)}")
            return jsonify({
                'error': 'Anthropic API error',
                'details': str(ae),
                'api_status': 'api_error'
            }), 500
            
        except Exception as e:
            logger.error(f"Generation error: {str(e)}")
            return jsonify({
                'error': 'Content generation failed',
                'details': str(e),
                'api_status': 'generation_error'
            }), 500

    except Exception as e:
        logger.error(f"Request processing error: {str(e)}")
        return jsonify({
            'error': 'Request processing failed',
            'details': str(e),
            'api_status': 'request_error'
        }), 500