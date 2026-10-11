import io
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app
from app.services.model_service import model_service

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "docs" in data


def test_health_endpoint():
    # Test top-level endpoint
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "model_loaded" in data
    assert "version" in data

    # Test api/v1 prefixed endpoint
    response_v1 = client.get("/api/v1/health")
    assert response_v1.status_code == 200
    assert response_v1.json()["status"] == "healthy"


def test_model_info_endpoint():
    response = client.get("/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert "classes" in data
    assert "glioma" in data["classes"]
    assert "meningioma" in data["classes"]
    assert "notumor" in data["classes"]
    assert "pituitary" in data["classes"]
    assert data["num_classes"] == 4
    assert data["image_size"] == 256

    response_v1 = client.get("/api/v1/model-info")
    assert response_v1.status_code == 200


def test_predict_endpoint_with_synthetic_mri():
    # Create a synthetic 256x256 grayscale/RGB image
    img = Image.new("RGB", (256, 256), color=(40, 40, 40))
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    buffer.seek(0)

    files = {"file": ("test_mri.jpg", buffer, "image/jpeg")}
    response = client.post("/predict", files=files)
    assert response.status_code == 200
    data = response.json()

    assert "predicted_class" in data
    assert data["predicted_class"] in ["glioma", "meningioma", "notumor", "pituitary"]
    assert "confidence" in data
    assert 0.0 <= data["confidence"] <= 1.0
    assert "class_probabilities" in data
    assert len(data["class_probabilities"]) == 4
    assert "inference_time_ms" in data
    assert "description" in data


def test_predict_invalid_file_type():
    invalid_file = io.BytesIO(b"this is plain text not an image")
    files = {"file": ("fake.txt", invalid_file, "text/plain")}
    response = client.post("/predict", files=files)
    assert response.status_code == 400
    assert "error" in response.json()["status"]
