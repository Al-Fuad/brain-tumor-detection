import os
from pathlib import Path
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration settings."""
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = "Brain Tumor Detection API"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False

    HOST: str = "0.0.0.0"
    PORT: int = int(os.getenv("PORT", "8000"))

    # CORS configuration
    CORS_ORIGINS: Union[List[str], str] = ["*"]

    # ML Model Configuration
    # Fallback to local workspace model location if not overridden
    MODEL_PATH: str = os.getenv(
        "MODEL_PATH",
        str(
            Path(__file__).resolve().parent.parent.parent.parent
            / "ml"
            / "artifacts"
            / "brain-tumor-detection-model.keras"
        ),
    )
    IMAGE_SIZE: int = 256
    CLASS_NAMES: List[str] = ["glioma", "meningioma", "notumor", "pituitary"]
    MAX_FILE_SIZE_MB: int = 15
    MODEL_DOWNLOAD_URL: Union[str, None] = os.getenv("MODEL_DOWNLOAD_URL", None)

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["*"]


settings = Settings()
