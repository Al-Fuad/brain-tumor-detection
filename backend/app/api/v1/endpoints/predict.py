from fastapi import APIRouter, File, UploadFile, status
from app.schemas.prediction import PredictionResponse
from app.services.image_service import ImageService
from app.services.model_service import model_service

router = APIRouter()


@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict Brain Tumor from MRI Scan",
    description="Upload a brain MRI scan image (JPEG, PNG, WEBP, etc.) to detect tumor presence and classify tumor type.",
)
async def predict_mri(
    file: UploadFile = File(..., description="Brain MRI scan image file")
) -> PredictionResponse:
    content = await file.read()
    tensor = ImageService.validate_and_preprocess(content)
    prediction = model_service.predict(tensor, filename=file.filename)
    return prediction
