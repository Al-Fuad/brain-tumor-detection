import time
from fastapi import APIRouter
from app.core.config import settings
from app.schemas.health import HealthResponse
from app.services.model_service import model_service

router = APIRouter()
_start_time = time.time()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Check service liveness and neural model readiness.",
)
async def health_check() -> HealthResponse:
    uptime = round(time.time() - _start_time, 2)
    return HealthResponse(
        status="healthy",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        model_loaded=model_service.is_loaded,
        uptime_seconds=uptime,
    )
