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
    is_loading = getattr(model_service, "is_loading", False)
    if model_service.is_loaded:
        model_status = "ready"
    elif is_loading:
        model_status = "loading"
    elif model_service.load_error:
        model_status = "error"
    else:
        model_status = "missing"

    return HealthResponse(
        status="healthy",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        model_loaded=model_service.is_loaded,
        model_loading=is_loading,
        model_status=model_status,
        model_error=model_service.load_error if not model_service.is_loaded else None,
        uptime_seconds=uptime,
    )
