import io
from typing import Tuple
import numpy as np
from PIL import Image

from app.core.config import settings
from app.core.errors import InvalidImageError


class ImageService:
    """Service for handling image loading, validation, and preprocessing."""

    SUPPORTED_FORMATS = {"JPEG", "JPG", "PNG", "WEBP", "BMP", "TIFF"}

    @classmethod
    def validate_and_preprocess(
        cls,
        image_bytes: bytes,
        target_size: Tuple[int, int] = (settings.IMAGE_SIZE, settings.IMAGE_SIZE),
    ) -> np.ndarray:
        """
        Validates the raw image bytes and prepares a 4D batch tensor for model inference.

        Args:
            image_bytes: Raw binary content of the uploaded image file.
            target_size: Tuple of (height, width) expected by the neural network.

        Returns:
            np.ndarray: Preprocessed image tensor with shape (1, height, width, 3), float32 normalized in [0, 1].
        """
        if not image_bytes:
            raise InvalidImageError("Uploaded file is empty.")

        max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
        if len(image_bytes) > max_bytes:
            raise InvalidImageError(
                f"File size exceeds maximum allowed limit of {settings.MAX_FILE_SIZE_MB}MB."
            )

        try:
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()  # Verify integrity
            # Need to reopen because verify() messes up file pointer
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            raise InvalidImageError(f"Corrupted or invalid image file: {str(e)}")

        format_name = (image.format or "").upper()
        if format_name and format_name not in cls.SUPPORTED_FORMATS:
            raise InvalidImageError(
                f"Unsupported image format: {format_name}. Supported formats: {', '.join(sorted(cls.SUPPORTED_FORMATS))}"
            )

        # Convert to RGB (MRIs can be grayscale 'L' or RGBA)
        if image.mode != "RGB":
            image = image.convert("RGB")

        # Resize to expected input size (IMAGE_SIZE x IMAGE_SIZE)
        image = image.resize(target_size, Image.Resampling.BILINEAR)

        # Normalize pixel values to [0, 1] as in training pipeline
        img_array = np.array(image, dtype=np.float32) / 255.0

        # Expand batch dimension -> (1, 256, 256, 3)
        tensor = np.expand_dims(img_array, axis=0)
        return tensor
