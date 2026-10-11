from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse


class ModelNotLoadedError(Exception):
    """Raised when the ML model is not loaded or unavailable."""
    pass


class InvalidImageError(Exception):
    """Raised when the uploaded file is not a valid or readable image."""
    pass


def register_error_handlers(app: FastAPI) -> None:
    """Register custom exception handlers for the application."""

    @app.exception_handler(ModelNotLoadedError)
    async def model_not_loaded_handler(request: Request, exc: ModelNotLoadedError):
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "error",
                "message": str(exc) or "ML model is currently unavailable or still loading.",
                "path": request.url.path,
            },
        )

    @app.exception_handler(InvalidImageError)
    async def invalid_image_handler(request: Request, exc: InvalidImageError):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": "error",
                "message": str(exc),
                "path": request.url.path,
            },
        )
