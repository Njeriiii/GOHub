# Backend: app/utils/image_handler.py
from google.cloud import storage
import uuid
from PIL import Image
from io import BytesIO
from flask import current_app
import logging


class ImageHandler:
    """Handles image upload, validation, and storage for organization profiles"""

    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

    def __init__(self):
        self.storage_client = storage.Client()
        self.bucket = self.storage_client.bucket(current_app.config["GCS_BUCKET_NAME"])

    def allowed_file(self, filename):
        """Check if the file extension is allowed"""
        return (
            "." in filename
            and filename.rsplit(".", 1)[1].lower() in self.ALLOWED_EXTENSIONS
        )

    def process_image(self, file, image_type):
        """Process and optimize image before upload

        Args:
            file: FileStorage object from request
            image_type: str, either 'logo' or 'cover_photo'

        Returns:
            tuple: (processed_image_bytes, new_filename)
        """
        try:
            # Read image and convert to PIL Image
            image = Image.open(file)

            # Define size limits based on image type
            if image_type == "logo":
                max_size = (400, 400)  # Max size for logos
                min_size = (100, 100)  # Min size for logos
            else:  # cover_photo
                max_size = (1920, 1080)  # Max size for cover photos
                min_size = (800, 400)  # Min size for cover photos

            # Check minimum dimensions
            if image.size[0] < min_size[0] or image.size[1] < min_size[1]:
                raise ValueError(
                    f"Image too small. Minimum size is {min_size[0]}x{min_size[1]} pixels"
                )

            # Resize if larger than maximum size while maintaining aspect ratio
            image.thumbnail(max_size, Image.Resampling.LANCZOS)

            # Convert to RGB if necessary (handles RGBA PNG files)
            if image.mode in ("RGBA", "P"):
                image = image.convert("RGB")

            # Save to BytesIO with optimization
            output = BytesIO()
            image.save(output, format="JPEG", quality=85, optimize=True)
            output.seek(0)

            # Generate unique filename
            original_extension = file.filename.rsplit(".", 1)[1].lower()
            new_filename = f"{image_type}/{str(uuid.uuid4())}.jpg"

            return output.getvalue(), new_filename

        except Exception as e:
            logging.error(f"Error processing image: {str(e)}")
            raise

    def upload_image(self, file, image_type):
        """Upload image to Google Cloud Storage

        Args:
            file: FileStorage object from request
            image_type: str, either 'logo' or 'cover_photo'

        Returns:
            str: The public URL of the uploaded image
        """
        if not file:
            raise ValueError("No file provided")

        if not self.allowed_file(file.filename):
            raise ValueError("File type not allowed")

        try:
            # Process the image
            image_bytes, filename = self.process_image(file, image_type)

            # Create new blob and upload the file
            blob = self.bucket.blob(filename)
            blob.upload_from_string(image_bytes, content_type="image/jpeg")

            # Make the blob publicly readable
            blob.make_public()

            return filename

        except Exception as e:
            logging.error(f"Error uploading image: {str(e)}")
            raise

    def delete_image(self, filename):
        """Delete image from Google Cloud Storage"""
        if not filename:
            return

        try:
            blob = self.bucket.blob(filename)
            blob.delete()
        except Exception as e:
            logging.error(f"Error deleting image: {str(e)}")
            raise

