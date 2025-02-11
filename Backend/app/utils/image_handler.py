# Backend: app/utils/image_handler.py
from google.cloud import storage
import uuid
from PIL import Image
from io import BytesIO
from flask import current_app
import logging
import os
from datetime import datetime


class ImageHandler:
    """Handles image upload, validation, and storage for organization profiles"""

    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

    def __init__(self):
        """Initialize GCS client and bucket"""
        self.storage_client = storage.Client()
        self.bucket = self.storage_client.bucket(os.getenv("GCS_BUCKET_NAME"))

    def allowed_file(self, filename):
        """
        Check if the file extension is allowed
        Args:
            filename (str): Name of the uploaded file
        Returns:
            bool: True if file extension is allowed, False otherwise
        """
        return (
            "." in filename
            and filename.rsplit(".", 1)[1].lower() in self.ALLOWED_EXTENSIONS
        )

    def process_image(self, file, image_type):
        """
        Process and optimize image before upload
        Args:
            file: FileStorage object from request
            image_type (str): Either 'logo' or 'cover_photo'
        Returns:
            tuple: (processed_image_bytes, new_filename)
        Raises:
            ValueError: If image dimensions are too small
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
                    f"Image too small. Minimum size is {min_size[0]}x{min_size[1]} pixels. "
                    f"Uploaded image is {image.size[0]}x{image.size[1]} pixels."
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

            # Generate unique filename with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            new_filename = f"{image_type}/{timestamp}_{str(uuid.uuid4())[:8]}.jpg"

            return output.getvalue(), new_filename

        except Exception as e:
            logging.error(f"Error processing image: {str(e)}")
            raise ValueError(f"Error processing image: {str(e)}")

    def upload_image(self, file, image_type):
        """
        Upload image to Google Cloud Storage
        Args:
            file: FileStorage object from request
            image_type (str): Either 'logo' or 'cover_photo'
        Returns:
            str: The filename of the uploaded image
        Raises:
            ValueError: If file validation or upload fails
        """
        if not file:
            raise ValueError("No file provided")

        if not self.allowed_file(file.filename):
            raise ValueError(
                f"File type not allowed. Supported types: {', '.join(self.ALLOWED_EXTENSIONS)}"
            )

        try:
            # Process the image
            image_bytes, filename = self.process_image(file, image_type)

            # Create new blob and upload the file
            blob = self.bucket.blob(filename)
            blob.upload_from_string(
                image_bytes,
                content_type="image/jpeg",
                timeout=30,  # Add timeout for upload
            )

            return filename

        except ValueError as e:
            raise  # Re-raise ValueError for handling in route
        except Exception as e:
            logging.error(f"Error uploading image: {str(e)}")
            raise ValueError(f"Error uploading image: {str(e)}")

    def delete_image(self, filename):
        """
        Delete image from Google Cloud Storage
        Args:
            filename (str): Name of file to delete
        """
        if not filename:
            return

        try:
            blob = self.bucket.blob(filename)
            blob.delete(timeout=30)
        except Exception as e:
            logging.error(f"Error deleting image: {str(e)}")
            # Don't raise - deletion errors shouldn't block new uploads

    def get_public_url(self, filename):
        """
        Get the public URL for an uploaded file
        Args:
            filename (str): Name of the file
        Returns:
            str or None: Public URL of the file, or None if filename is empty
        """
        if not filename:
            return None
        return f"https://storage.googleapis.com/{self.bucket.name}/{filename}"
