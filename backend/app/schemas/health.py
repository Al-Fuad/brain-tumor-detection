from typing import Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Schema for API health status."""
    status: str = Field(..., json_schema_extra={"example": "healthy"}, description="Current service health status")
    app_name: str = Field(..., description="Application name")
    version: str = Field(..., description="Application version")
    model_loaded: bool = Field(..., description="Whether the neural network model is loaded and ready")
    uptime_seconds: Optional[float] = Field(None, description="Service uptime in seconds")
