import logging
import os
import time
from typing import Dict, List, Optional
import numpy as np
import keras

from app.core.config import settings
from app.core.errors import ModelNotLoadedError
from app.schemas.prediction import ClassProbability, PredictionResponse

logger = logging.getLogger(__name__)

CLASS_DESCRIPTIONS: Dict[str, str] = {
    "glioma": (
        "Glioma is a type of tumor that arises from glial cells surrounding and supporting neurons in the brain."
    ),
    "meningioma": (
        "Meningioma develops in the meninges, the protective membranes enveloping the brain and spinal cord."
    ),
    "pituitary": (
        "Pituitary tumor arises from the pituitary gland at the base of the brain, regulating hormonal functions."
    ),
    "notumor": (
        "No tumor detected. The scan shows no abnormal neoplastic lesion among the evaluated tumor categories."
    ),
}


class ModelService:
    """Singleton service for loading, caching, and serving predictions from the Keras model."""

    _instance: Optional["ModelService"] = None

    def __init__(self):
        self.model: Optional[keras.Model] = None
        self.model_path: str = settings.MODEL_PATH
        self.class_names: List[str] = settings.CLASS_NAMES
        self.is_loaded: bool = False
        self.load_error: Optional[str] = None

    @classmethod
    def get_instance(cls) -> "ModelService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_model(self) -> bool:
        """Loads the Keras model from disk and warms it up."""
        if self.is_loaded and self.model is not None:
            return True

        if not os.path.exists(self.model_path):
            self.load_error = f"Model artifact not found at: {self.model_path}"
            logger.warning(self.load_error)
            return False

        try:
            logger.info("Loading Keras model from %s...", self.model_path)
            self.model = keras.models.load_model(self.model_path)
            self.is_loaded = True
            self.load_error = None
            logger.info("Model loaded successfully. Warming up with dummy input...")

            # Warmup inference
            dummy_input = np.zeros(
                (1, settings.IMAGE_SIZE, settings.IMAGE_SIZE, 3), dtype=np.float32
            )
            _ = self.model.predict(dummy_input, verbose=0)
            logger.info("Model warmup complete.")
            return True
        except Exception as e:
            self.load_error = str(e)
            self.is_loaded = False
            logger.error("Failed to load model: %s", str(e), exc_info=True)
            return False

    def predict(self, preprocessed_image: np.ndarray, filename: Optional[str] = None) -> PredictionResponse:
        """
        Executes model inference on a preprocessed 4D image tensor.

        Args:
            preprocessed_image: Tensor of shape (1, 256, 256, 3).
            filename: Optional source filename.

        Returns:
            PredictionResponse with probabilities, detected class, and metrics.
        """
        if not self.is_loaded or self.model is None:
            # Try lazy load if possible
            if not self.load_model():
                raise ModelNotLoadedError(
                    f"Model is not loaded. {self.load_error or 'Please check server logs.'}"
                )

        start_time = time.perf_counter()
        raw_predictions = self.model.predict(preprocessed_image, verbose=0)
        inference_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        # Probabilities vector for first sample
        probs = raw_predictions[0]
        # Softmax if not already normalized sum
        sum_probs = np.sum(probs)
        if sum_probs > 0:
            probs = probs / sum_probs

        predicted_idx = int(np.argmax(probs))
        predicted_class = self.class_names[predicted_idx]
        confidence = float(probs[predicted_idx])

        class_probabilities: List[ClassProbability] = []
        probabilities_dict: Dict[str, float] = {}

        for idx, class_name in enumerate(self.class_names):
            p = float(probs[idx])
            probabilities_dict[class_name] = round(p, 4)
            class_probabilities.append(
                ClassProbability(
                    label=class_name,
                    probability=round(p, 4),
                    percentage=round(p * 100, 2),
                )
            )

        # Sort highest probability first
        class_probabilities.sort(key=lambda x: x.probability, reverse=True)

        is_tumor_detected = predicted_class != "notumor"
        description = CLASS_DESCRIPTIONS.get(
            predicted_class,
            "Classification completed based on trained multi-class neural network."
        )

        return PredictionResponse(
            predicted_class=predicted_class,
            confidence=round(confidence, 4),
            confidence_percentage=round(confidence * 100, 2),
            is_tumor_detected=is_tumor_detected,
            description=description,
            class_probabilities=class_probabilities,
            probabilities_dict=probabilities_dict,
            inference_time_ms=inference_time_ms,
            filename=filename,
        )

    def get_info(self) -> dict:
        """Returns structured metadata about the neural model."""
        exists = os.path.exists(self.model_path)
        input_shape = list(self.model.input_shape) if self.model else [None, settings.IMAGE_SIZE, settings.IMAGE_SIZE, 3]

        return {
            "model_name": "Brain Tumor Classifier (VGG16 Transfer Learning)",
            "architecture": "VGG16 + Custom Dense Head",
            "input_shape": input_shape,
            "image_size": settings.IMAGE_SIZE,
            "channels": 3,
            "classes": self.class_names,
            "num_classes": len(self.class_names),
            "model_file_exists": exists,
            "model_path": self.model_path,
            "metadata": {
                "framework": f"Keras {keras.__version__}",
                "loaded_in_memory": self.is_loaded,
                "load_error": self.load_error,
            },
        }


model_service = ModelService.get_instance()
