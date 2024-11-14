from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from app import db
from models import Image, User
from utils import generate_image_from_text

image_bp = Blueprint('image', __name__)

@image_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_image():
    data = request.get_json()
    text = data.get('text')

    if not text:
        return jsonify({'message': 'Text input is required'}), 400

    # Generate image from text
    image_path = generate_image_from_text(text)
    
    # Save image record to database
    user_id = get_jwt_identity()['id']
    new_image = Image(user_id=user_id, image_path=image_path)
    db.session.add(new_image)
    db.session.commit()

    return jsonify({'message': 'Image generated successfully', 'image_path': image_path}), 201
