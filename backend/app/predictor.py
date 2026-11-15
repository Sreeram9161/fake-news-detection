import os
import sys
from pathlib import Path

# Ensure backend root is always on sys.path
backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import re
import json
import logging
from typing import Dict, Any, Optional
import joblib

try:
    from app.config import MODEL_PATH, METADATA_PATH
except ImportError:
    from config import MODEL_PATH, METADATA_PATH

logger = logging.getLogger(__name__)

class NewsPredictor:
    """Production predictor service for Fake News Detection."""

    def __init__(self):
        self.pipeline = None
        self.metadata = {}
        self.is_loaded = False
        self.load_model()

    def load_model(self):
        """Load trained Joblib pipeline and model metadata."""
        try:
            if os.path.exists(MODEL_PATH):
                logger.info(f"Loading ML pipeline from {MODEL_PATH}...")
                self.pipeline = joblib.load(MODEL_PATH)
                self.is_loaded = True
            else:
                logger.warning(f"Model file not found at {MODEL_PATH}. Prediction service idle.")

            if os.path.exists(METADATA_PATH):
                with open(METADATA_PATH, "r") as f:
                    self.metadata = json.load(f)
        except Exception as e:
            logger.error(f"Error loading model or metadata: {e}", exc_info=True)
            self.is_loaded = False

    @staticmethod
    def clean_text(text: str) -> str:
        """Apply identical preprocessing transformation as used during model training."""
        if not isinstance(text, str):
            return ""
        text = text.lower()
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', ' ', text)
        # Remove URLs
        text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
        # Remove emails
        text = re.sub(r'\S+@\S+', ' ', text)
        # Remove non-alphabetical characters
        text = re.sub(r'[^a-z\s]', ' ', text)
        # Collapse whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def predict(self, headline: Optional[str], article_text: str) -> Dict[str, Any]:
        """Perform authenticity classification on provided headline and article content."""
        if not self.is_loaded or self.pipeline is None:
            # Attempt hot-reload if model was just trained
            self.load_model()
            if not self.is_loaded:
                raise RuntimeError("Machine Learning model pipeline is not currently loaded or trained.")

        h_str = (headline or "").strip()
        a_str = (article_text or "").strip()
        combined_raw = f"{h_str} {a_str}".strip()

        if len(combined_raw) < 10:
            raise ValueError("Input text is too short. Please provide at least 10 characters for meaningful analysis.")

        cleaned_text = self.clean_text(combined_raw)
        word_count = len(combined_raw.split())
        char_count = len(combined_raw)

        # Vectorization and inference via Scikit-Learn Pipeline
        prediction_label = int(self.pipeline.predict([cleaned_text])[0])
        
        # In WELFake: 0 = REAL, 1 = FAKE
        prediction_str = "REAL" if prediction_label == 0 else "FAKE"

        # Extract calibrated probabilities if available
        if hasattr(self.pipeline, "predict_proba"):
            probs = self.pipeline.predict_proba([cleaned_text])[0]
            # probs[0] = prob of REAL, probs[1] = prob of FAKE
            prob_real = float(probs[0])
            prob_fake = float(probs[1])
            confidence = (prob_real if prediction_label == 0 else prob_fake) * 100.0
        else:
            prob_real = 1.0 if prediction_label == 0 else 0.0
            prob_fake = 1.0 if prediction_label == 1 else 0.0
            confidence = 100.0

        # Assess risk level
        if prediction_str == "FAKE":
            risk_level = "High" if confidence >= 80.0 else "Moderate"
        else:
            risk_level = "Low"

        # Generate intelligent summary
        best_algo = self.metadata.get("best_model", "Machine Learning Pipeline")
        if prediction_str == "REAL":
            analysis_summary = (
                f"The text exhibits linguistic and stylistic consistency commonly observed in verified, factual reporting. "
                f"The model classified this article as REAL with {confidence:.1f}% confidence based on standard journalistic syntax, "
                f"measured tone, and contextual vocabulary."
            )
        else:
            analysis_summary = (
                f"The text demonstrates textual patterns, lexical anomalies, or rhetorical markers typically identified in unverified "
                f"or fabricated news reports. Classified as FAKE with {confidence:.1f}% estimated probability."
            )

        article_preview = a_str[:220] + "..." if len(a_str) > 220 else a_str

        return {
            "prediction": prediction_str,
            "label": prediction_label,
            "confidence": round(confidence, 2),
            "probability_real": round(prob_real, 4),
            "probability_fake": round(prob_fake, 4),
            "risk_level": risk_level,
            "word_count": word_count,
            "char_count": char_count,
            "headline_submitted": h_str if h_str else "N/A (Full text provided)",
            "article_preview": article_preview,
            "analysis_summary": analysis_summary,
            "model_used": best_algo,
            "disclaimer": (
                "Notice: This prediction is generated by a statistical machine learning model trained on historical news corpora. "
                "It evaluates linguistic features and stylistic patterns, but does not perform real-time investigative fact verification. "
                "Always cross-reference critical claims with primary, reputable journalistic sources."
            )
        }

# Global predictor instance
predictor_instance = NewsPredictor()
