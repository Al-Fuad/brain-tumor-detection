from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class ClassProbability(BaseModel):
    """Probability detail for an individual class."""
    label: str = Field(..., description="Class name")
    probability: float = Field(..., description="Confidence score between 0.0 and 1.0")
    percentage: float = Field(..., description="Confidence percentage between 0% and 100%")


class PredictionResponse(BaseModel):
    """Schema for image classification prediction response."""
    predicted_class: str = Field(..., description="Highest probability predicted class")
    confidence: float = Field(..., description="Highest confidence probability [0.0 - 1.0]")
    confidence_percentage: float = Field(..., description="Highest confidence as percentage")
    is_tumor_detected: bool = Field(..., description="True if a tumor (glioma, meningioma, pituitary) is detected")
    description: str = Field(..., description="Clinical context or summary regarding the predicted class")
    class_probabilities: List[ClassProbability] = Field(..., description="Probabilities for each class")
    probabilities_dict: Dict[str, float] = Field(..., description="Key-value mapping of class to probability")
    inference_time_ms: float = Field(..., description="Model inference duration in milliseconds")
    filename: Optional[str] = Field(None, description="Original filename of uploaded MRI")
