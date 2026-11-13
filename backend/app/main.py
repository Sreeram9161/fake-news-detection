import os
import time
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from app.config import (
    API_TITLE,
    API_SUBTITLE,
    API_VERSION,
    ALLOWED_ORIGINS,
    METADATA_PATH,
    MODEL_PATH
)
from app.schemas import (
    PredictionRequest,
    PredictionResponse,
    ModelInfoResponse,
    HealthResponse
)
from app.predictor import predictor_instance

# Initialize FastAPI application
app = FastAPI(
    title=API_TITLE,
    description=f"{API_SUBTITLE} - Academic Final Project REST API",
    version=API_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware setup - Allows all localhost/127.0.0.1 ports cleanly
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount results/graphs as static directory for frontend visual inspection if available
graphs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "results", "graphs"))
if os.path.exists(graphs_dir):
    app.mount("/static/graphs", StaticFiles(directory=graphs_dir), name="graphs")

@app.get("/", tags=["Root"])
def root():
    return {
        "project": API_TITLE,
        "subtitle": API_SUBTITLE,
        "version": API_VERSION,
        "status": "online",
        "documentation": "/docs",
        "endpoints": {
            "health": "/health",
            "predict": "/predict (POST)",
            "model_info": "/model-info"
        }
    }

@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """Verify backend API operational status and ML model availability."""
    return HealthResponse(
        status="healthy",
        model_loaded=predictor_instance.is_loaded,
        model_name=predictor_instance.metadata.get("best_model", "Unknown" if not predictor_instance.is_loaded else "Trained Pipeline"),
        version=API_VERSION,
        timestamp=time.strftime("%Y-%m-%d %H:%M:%S")
    )

@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict_news(request: PredictionRequest):
    """
    Accepts news headline and body content, validates inputs, and predicts
    whether the given text is REAL (0) or FAKE (1) with calibrated confidence probabilities.
    """
    if not request.article_text or not request.article_text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Article text cannot be empty. Please provide article content to analyze."
        )

    try:
        result = predictor_instance.predict(
            headline=request.headline,
            article_text=request.article_text
        )
        return PredictionResponse(**result)
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except RuntimeError as re:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(re)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal error during prediction: {str(e)}"
        )

@app.get("/model-info", response_model=ModelInfoResponse, tags=["Model Info"])
def get_model_information():
    """Returns training parameters, dataset provenance, comparative metrics, and algorithmic details."""
    meta = predictor_instance.metadata
    if not meta:
        predictor_instance.load_model()
        meta = predictor_instance.metadata

    if not meta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model metadata is not yet available. Please ensure model training has been completed."
        )

    limitations = [
        "Domain Generalization: The model was trained on historical English news datasets (WELFake corpus) and may have lower sensitivity to breaking slang or non-English content.",
        "Satire and Parody: Sarcastic or satirical news (e.g., The Onion) uses standard grammatical syntax and may occasionally be classified as genuine news by lexical n-gram models.",
        "Fact Verification vs Text Authenticity: The model identifies linguistic cues, stylometry, and vocabulary distributions; it does not query live knowledge graphs or search engines for real-time fact checks.",
        "Temporal Drift: News terminology evolves rapidly; models should be periodically retrained with recent verified and debunked articles."
    ]

    return ModelInfoResponse(
        dataset_name=meta.get("dataset_name", "WELFake Dataset"),
        dataset_source=meta.get("dataset_source", "IEEE Transactions on Computational Social Systems"),
        dataset_citation=meta.get("dataset_citation", "P. K. Verma et al. (2021)"),
        total_records_analyzed=meta.get("total_records_analyzed", 72134),
        cleaned_records=meta.get("cleaned_records", 23929),
        train_samples=meta.get("train_samples", 19143),
        test_samples=meta.get("test_samples", 4786),
        class_mapping=meta.get("class_mapping", {"0": "REAL", "1": "FAKE"}),
        features_used=meta.get("features_used", ["title", "text"]),
        vectorizer=meta.get("vectorizer", "TF-IDF (10,000 features, Unigram + Bigram)"),
        best_model=meta.get("best_model", "Logistic Regression"),
        models_benchmarked=meta.get("models_benchmarked", ["Logistic Regression", "Multinomial Naive Bayes", "Linear SVM"]),
        metrics_summary=meta.get("metrics_summary", {}),
        trained_timestamp=meta.get("trained_timestamp", time.strftime("%Y-%m-%d %H:%M:%S")),
        limitations=limitations
    )
