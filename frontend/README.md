# NeuroScan AI — Frontend Application

Modern React 19 + Vite web client for Brain Tumor MRI Detection and Classification. Ready for deployment on Vercel.

## Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/       # Header, Footer
│   │   ├── info/         # ClassGuide, ModelInfoModal
│   │   ├── prediction/   # PredictionResult, ConfidenceBar
│   │   └── upload/       # ImageDropzone
│   ├── hooks/            # usePredict, useBackendInfo
│   ├── services/         # api.js fetch client
│   ├── utils/            # formatters & clinical configs
│   ├── App.jsx           # Main coordinator
│   ├── App.css           # Modern clinical UI styling
│   └── index.css         # Design system & tokens
├── vercel.json           # Vercel configuration
├── vite.config.js
└── package.json
```

## Running Locally

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

## Environment Variables

- `VITE_API_BASE_URL`: URL of the FastAPI backend (e.g. `http://localhost:8000` or `https://your-backend.onrender.com`).
