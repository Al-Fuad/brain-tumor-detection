from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ModelInfoResponse(BaseModel):
    """Schema for model architecture and metadata."""
    model_name: str = Field(..., description="Name of the model")
    architecture: str = Field(..., description="Base model architecture")
    input_shape: List[Optional[int]] = Field(..., description="Expected input tensor shape")
    image_size: int = Field(..., description="Image height and width in pixels")
    channels: int = Field(..., description="Number of image color channels")
    classes: List[str] = Field(..., description="List of detectable tumor classes")
    num_classes: int = Field(..., description="Total number of classes")
    model_file_exists: bool = Field(..., description="Whether the model file exists on disk")
    model_path: str = Field(..., description="Resolved path of the model file")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional model metadata")
