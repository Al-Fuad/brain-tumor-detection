# Brain Tumor Detection — Backend Service

Production-ready FastAPI backend serving deep learning inference for brain tumor detection.

## Structure

```
backend/
├── app/
│   ├── api/v1/endpoints/  # health, model_info, predict
│   ├── core/              # config & custom error handlers
│   ├── schemas/           # Pydantic models for responses
│   ├── services/          # image preprocessing & model loader singleton
│   └── main.py            # FastAPI entry point
├── tests/                 # pytest test suite
├── Dockerfile             # Docker container definition
├── Procfile               # Render web process definition
├── render.yaml            # Render Blueprint config
└── requirements.txt
```

## Running Locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Testing

```bash
PYTHONPATH=. pytest tests/ -v
```

## Endpoints

- `GET /health`: Liveness & model readiness check
- `GET /model-info`: Model architecture and class definitions
- `POST /predict`: Upload MRI scan (`multipart/form-data`) for classification
