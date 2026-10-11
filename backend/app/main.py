import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.errors import register_error_handlers
from app.services.model_service import model_service

logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("brain_tumor_backend")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for startup and shutdown procedures."""
    logger.info("Starting up %s v%s...", settings.APP_NAME, settings.APP_VERSION)
    # Eagerly load model on startup
    loaded = model_service.load_model()
    if loaded:
        logger.info("Neural network model loaded and warmed up successfully.")
    else:
        logger.warning(
            "Model could not be loaded at startup: %s. Requests will attempt lazy load.",
            model_service.load_error,
        )
    yield
    logger.info("Shutting down %s...", settings.APP_NAME)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Production-grade FastAPI backend for Deep Learning-based Brain Tumor MRI Classification.\n\n"
        "Features 3 core APIs:\n"
        "- **Health**: Service and model readiness status\n"
        "- **Model Info**: Neural architecture specifications, input dimensions, and class labels\n"
        "- **Predict**: Multi-class MRI tumor classification (Glioma, Meningioma, Pituitary, or No Tumor)"
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register custom exception handlers
register_error_handlers(app)

# Include routes under /api/v1 prefix
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# Also expose at top-level (/health, /model-info, /predict) for convenience
app.include_router(api_router)


@app.get("/", include_in_schema=False)
async def root():
    return JSONResponse(
        content={
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "online",
            "docs": "/docs",
            "endpoints": {
                "health": "/health",
                "model_info": "/model-info",
                "predict": "/predict",
            },
        }
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
