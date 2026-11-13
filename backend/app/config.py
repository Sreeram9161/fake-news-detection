import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "fake_news_pipeline.joblib"
METADATA_PATH = MODEL_DIR / "model_metadata.json"

# API Settings
API_TITLE = "Fake News Detection System API"
API_SUBTITLE = "AI-Powered News Authenticity Classification"
API_VERSION = "1.0.0"

# CORS Configuration - Explicit local development origins
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]
