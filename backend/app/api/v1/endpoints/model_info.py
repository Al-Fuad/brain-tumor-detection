from fastapi import APIRouter
from app.schemas.model_info import ModelInfoResponse
from app.services.model_service import model_service

router = APIRouter()


@router.get(
    "/model-info",
    response_model=ModelInfoResponse,
    summary="Model Information",
    description="Retrieve model metadata, architecture details, and detectable tumor classes.",
)
async def get_model_info() -> ModelInfoResponse:
    info = model_service.get_info()
    return ModelInfoResponse(**info)
