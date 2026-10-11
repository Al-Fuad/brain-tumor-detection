from fastapi import APIRouter
from app.api.v1.endpoints import health, model_info, predict

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(model_info.router, tags=["Model Info"])
api_router.include_router(predict.router, tags=["Prediction"])
