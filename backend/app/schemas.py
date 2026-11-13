from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    headline: Optional[str] = Field(default="", description="News headline or title")
    article_text: str = Field(..., min_length=10, description="Full news article content or statement")

    class Config:
        json_schema_extra = {
            "example": {
                "headline": "Federal Reserve Announces Benchmark Interest Rate Decision",
                "article_text": "The Federal Reserve concluded its monetary policy meeting today, announcing that benchmark interest rates will remain unchanged amid moderating inflation metrics and stable employment data."
            }
        }

class PredictionResponse(BaseModel):
    prediction: str = Field(..., description="'REAL' or 'FAKE'")
    label: int = Field(..., description="0 for REAL, 1 for FAKE")
    confidence: float = Field(..., description="Confidence percentage (0 to 100)")
    probability_real: float = Field(..., description="Estimated probability of being genuine news")
    probability_fake: float = Field(..., description="Estimated probability of being fabricated news")
    risk_level: str = Field(..., description="'Low', 'Moderate', or 'High' risk of misinformation")
    word_count: int = Field(..., description="Total word count in submitted news")
    char_count: int = Field(..., description="Total character count in submitted news")
    headline_submitted: str
    article_preview: str
    analysis_summary: str
    model_used: str
    disclaimer: str

class AlgorithmMetric(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: Optional[float] = 0.0
    train_time_sec: Optional[float] = 0.0
    confusion_matrix: List[List[int]]

class ModelInfoResponse(BaseModel):
    dataset_name: str
    dataset_source: str
    dataset_citation: str
    total_records_analyzed: int
    cleaned_records: int
    train_samples: int
    test_samples: int
    class_mapping: Dict[str, str]
    features_used: List[str]
    vectorizer: str
    best_model: str
    models_benchmarked: List[str]
    metrics_summary: Dict[str, AlgorithmMetric]
    trained_timestamp: str
    limitations: List[str]

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: Optional[str] = None
    version: str
    timestamp: str
