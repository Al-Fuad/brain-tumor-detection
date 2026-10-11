# 🧠 NeuroScan AI — Brain Tumor Detection & MRI Classification

[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16+-FF6F00.svg?logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deploy on Render](https://img.shields.io/badge/Deploy%20Backend-Render-46E3B7.svg)](https://render.com)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20Frontend-Vercel-000000.svg?logo=vercel&logoColor=white)](https://vercel.com)

A full-stack, production-ready deep learning application for detecting and classifying brain tumors from Magnetic Resonance Imaging (MRI) scans. Powered by a **VGG16 Transfer Learning** convolutional neural network, a **FastAPI** backend designed with Clean Architecture principles, and a modern **React (Vite)** frontend.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Machine Learning Model](#-machine-learning-model)
- [API Endpoints](#-api-endpoints)
- [Frontend Features](#-frontend-features)
- [Project Directory Structure](#-project-directory-structure)
- [Local Development Setup](#-local-development-setup)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [Deployment Guide](#-deployment-guide)
  - [Deploy Backend to Render](#deploy-backend-to-render)
  - [Deploy Frontend to Vercel](#deploy-frontend-to-vercel)
- [Testing](#-testing)
- [Medical Disclaimer](#-medical-disclaimer)
- [License](#-license)

---

## 🌟 Overview

Brain tumors represent one of the most critical neurological conditions requiring rapid, high-precision radiological assessment. **NeuroScan AI** provides:
1. **Automated Multi-Class Classification**: Identifies whether a scan is healthy or exhibits **Glioma**, **Meningioma**, or **Pituitary** tumors.
2. **Instant Visual Feedback**: The input MRI scan is presented alongside real-time inference telemetry, confidence score distribution, and clinical taxonomy profiles.
3. **Enterprise & Cloud Ready**: Packaged for 1-click deployment on **Render** (FastAPI backend) and **Vercel** (React frontend).

---

## 🏗 System Architecture

```
   ┌────────────────────────────────────────────────────────┐
   │                   React Frontend                       │
   │               (Vercel Cloud Hosting)                   │
   │   • Drag & Drop Image Uploader                         │
   │   • Side-by-Side MRI Image & Prediction Showcase       │
   │   • Animated Probability Breakdown                     │
   └───────────────────────────┬────────────────────────────┘
                               │
                      HTTPS / JSON & Multipart
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │                  FastAPI Backend                       │
   │               (Render Web Service)                     │
   │   • Core Settings & Error Handlers                     │
   │   • Image Preprocessing Service (RGB, 256x256, [0, 1]) │
   │   • Model Service (Inference Caching & Warmup)         │
   │   • REST Endpoints: /health, /model-info, /predict     │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │             VGG16 Transfer Learning Model              │
   │         `ml/artifacts/brain-tumor-detection-model.keras`│
   └────────────────────────────────────────────────────────┘
```

---

## 🔬 Machine Learning Model

- **Base Architecture**: VGG16 pre-trained on ImageNet with fine-tuned top convolutional blocks
- **Classification Head**: Flatten $\rightarrow$ Dropout(0.3) $\rightarrow$ Dense(256, ReLU) $\rightarrow$ Dropout(0.2) $\rightarrow$ Dense(4, Softmax)
- **Input Dimension**: `(256, 256, 3)` (RGB normalized to $[0.0, 1.0]$)
- **Classes**:
  1. `glioma`: Tumors originating in glial cells
  2. `meningioma`: Tumors originating in the protective meningeal membranes
  3. `notumor`: Healthy scan with no detectable neoplastic mass
  4. `pituitary`: Tumors originating in the pituitary gland
- **Artifact Path**: `ml/artifacts/brain-tumor-detection-model.keras`

---

## 🚀 API Endpoints

The backend exposes 3 core endpoints (available both at the root level and under `/api/v1`):

### 1. `GET /health`
Checks backend liveness and neural model readiness in memory.
```json
{
  "status": "healthy",
  "app_name": "Brain Tumor Detection API",
  "version": "1.0.0",
  "model_loaded": true,
  "uptime_seconds": 128.4
}
```

### 2. `GET /model-info`
Provides model metadata, input specifications, and detectable classes.
```json
{
  "model_name": "Brain Tumor Classifier (VGG16 Transfer Learning)",
  "architecture": "VGG16 + Custom Dense Head",
  "input_shape": [null, 256, 256, 3],
  "image_size": 256,
  "channels": 3,
  "classes": ["glioma", "meningioma", "notumor", "pituitary"],
  "num_classes": 4,
  "model_file_exists": true,
  "model_path": "ml/artifacts/brain-tumor-detection-model.keras"
}
```

### 3. `POST /predict`
Accepts an image file (`multipart/form-data`) and outputs the classified diagnosis and confidence distribution.
- **Request**: `file`: Image file (PNG, JPG, JPEG, WEBP)
- **Response**:
```json
{
  "predicted_class": "glioma",
  "confidence": 0.9842,
  "confidence_percentage": 98.42,
  "is_tumor_detected": true,
  "description": "Glioma is a type of tumor that arises from glial cells surrounding and supporting neurons in the brain.",
  "class_probabilities": [
    { "label": "glioma", "probability": 0.9842, "percentage": 98.42 },
    { "label": "meningioma", "probability": 0.0118, "percentage": 1.18 },
    { "label": "notumor", "probability": 0.0025, "percentage": 0.25 },
    { "label": "pituitary", "probability": 0.0015, "percentage": 0.15 }
  ],
  "probabilities_dict": {
    "glioma": 0.9842,
    "meningioma": 0.0118,
    "notumor": 0.0025,
    "pituitary": 0.0015
  },
  "inference_time_ms": 38.65,
  "filename": "brain_scan.jpg"
}
```

Interactive OpenAPI documentation is automatically served at `/docs` (Swagger UI) and `/redoc`.

---

## 💻 Frontend Features

- **Clean Component Architecture**: Decoupled presentation, custom hooks (`usePredict`, `useBackendInfo`), and API service layer.
- **Side-by-Side Image Showcase**: When predictions are generated, the analyzed MRI scan is displayed with targeting reticles, status badges, and telemetry alongside the results.
- **Responsive Layout**: Adapts gracefully across ultra-wide monitors, laptops, tablets, and mobile screens.
- **Zero-Friction Testing**: Built-in sample MRI scan generators permit instant end-to-end testing without downloading external datasets.
- **Real-Time Backend Status**: Live pulse badge indicating API connectivity and model readiness.

---

## 📁 Project Directory Structure

```
brain-tumor/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── health.py        # GET /health
│   │   │   │   ├── model_info.py    # GET /model-info
│   │   │   │   └── predict.py       # POST /predict
│   │   │   └── router.py            # Aggregated v1 router
│   │   ├── core/
│   │   │   ├── config.py            # Pydantic Settings
│   │   │   └── errors.py            # Custom exception handlers
│   │   ├── schemas/
│   │   │   ├── health.py            # HealthResponse schema
│   │   │   ├── model_info.py        # ModelInfoResponse schema
│   │   │   └── prediction.py        # PredictionResponse schema
│   │   ├── services/
│   │   │   ├── image_service.py     # Resize, RGB conversion, normalize
│   │   │   └── model_service.py     # Model loading, warmup, inference
│   │   └── main.py                  # FastAPI app & CORS lifecycle
│   ├── tests/
│   │   └── test_api.py              # Pytest test suite for all 3 endpoints
│   ├── Dockerfile                   # Container definition
│   ├── Procfile                     # Render process file
│   ├── render.yaml                  # Render Blueprint definition
│   ├── requirements.txt             # Backend dependencies
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Header, Footer
│   │   │   ├── info/                # ClassGuide, ModelInfoModal
│   │   │   ├── prediction/          # PredictionResult, ConfidenceBar
│   │   │   └── upload/              # ImageDropzone
│   │   ├── hooks/                   # usePredict, useBackendInfo
│   │   ├── services/                # api.js
│   │   ├── utils/                   # formatters.js
│   │   ├── App.jsx                  # Main application component
│   │   ├── App.css                  # Modern UI styles
│   │   ├── index.css                # Global design system & tokens
│   │   └── main.jsx
│   ├── vercel.json                  # Vercel deployment configuration
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── ml/
│   ├── artifacts/
│   │   └── brain-tumor-detection-model.keras # 216 MB trained model
│   └── notebooks/
│       └── brain-tumor-notebook.ipynb        # Training & evaluation notebook
├── LICENSE                          # MIT License
└── README.md
```

---

## 🛠 Local Development Setup

### Prerequisites
- Python 3.10+ (Python 3.11 recommended)
- Node.js 18+ and npm 9+

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend will be live at `http://localhost:8000`. Test the interactive documentation at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables (optional, defaults to http://localhost:8000)
cp .env.example .env

# Run development server
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## ☁️ Deployment Guide

### Deploy Backend to Render

1. **Option A: Using Blueprint (`render.yaml`)**
   - Connect your GitHub repository to [Render](https://render.com).
   - Click **New** $\rightarrow$ **Blueprint** and select this repository.
   - Render will read [`backend/render.yaml`](file:///Users/nur/code/ml/projects/brain-tumor/backend/render.yaml) automatically.

2. **Option B: Manual Web Service**
   - In Render, click **New +** $\rightarrow$ **Web Service**.
   - Set **Root Directory** to `backend`.
   - Set **Runtime** to `Python 3`.
   - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path**: `/health`
   - Add Environment Variable:
     - `MODEL_PATH`: `../ml/artifacts/brain-tumor-detection-model.keras` (or copy the artifact into `backend/artifacts/`)
     - `CORS_ORIGINS`: `*` (or your frontend Vercel URL)

3. **Option C: Docker Runtime on Render**
   - Choose Docker runtime and specify [`backend/Dockerfile`](file:///Users/nur/code/ml/projects/brain-tumor/backend/Dockerfile).

---

### Deploy Frontend to Vercel

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New...** $\rightarrow$ **Project**.
3. Import this repository.
4. Set **Root Directory** to `frontend`.
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://<your-render-backend-subdomain>.onrender.com`
6. Click **Deploy**. Vercel will use [`frontend/vercel.json`](file:///Users/nur/code/ml/projects/brain-tumor/frontend/vercel.json) to build and deploy the React application.

---

## 🧪 Testing

Run backend tests using `pytest`:

```bash
cd backend
PYTHONPATH=. pytest tests/ -v
```

All 5 core test suites will execute:
- `test_root_endpoint`: Validates index API summary
- `test_health_endpoint`: Validates health and model readiness
- `test_model_info_endpoint`: Validates model architecture & class schemas
- `test_predict_endpoint_with_synthetic_mri`: Validates end-to-end inference & schema response
- `test_predict_invalid_file_type`: Validates file verification and 400 error handling

To verify frontend production bundle:
```bash
cd frontend
npm run build
```

---

## ⚠️ Medical Disclaimer

> **Important**: This software application is developed strictly for educational, informational, and academic machine learning research purposes. It is **not** a diagnostic medical tool, is not approved by medical regulatory authorities (such as the FDA or EMA), and should never be used as a substitute for professional clinical medical advice, radiological diagnosis, or treatment planning.

---

## 📄 License

This project is open-source and licensed under the terms of the [MIT License](LICENSE).
