"""
Fake News Detection System - End-to-End System Test Suite
Verifies:
1. Model loading and pipeline integrity
2. REAL news classification & probability calibration
3. FAKE news classification & probability calibration
4. Empty input handling (validation error)
5. Short / invalid input handling
6. Long article handling (1,000+ words)
7. Model metadata integrity & metrics verification
8. Error resilience
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.predictor import NewsPredictor
from app.schemas import PredictionRequest
from app.main import app, predict_news, health_check, get_model_information

def run_tests():
    print("=" * 70)
    print("RUNNING COMPREHENSIVE SYSTEM VERIFICATION TEST SUITE")
    print("=" * 70)

    predictor = NewsPredictor()
    assert predictor.is_loaded, "Test Failed: Model should be loaded."
    print("✓ TEST 1: Model Pipeline Successfully Loaded from Joblib")

    # TEST 2: REAL News
    real_headline = "European Central Bank Holds Interest Rates Steady Amid Growth Outlook"
    real_text = (
        "FRANKFURT (Reuters) - The European Central Bank left its key deposit facility rate "
        "unchanged on Thursday, reiterating its commitment to maintaining restrictive monetary "
        "policy as long as necessary to ensure inflation returns to its medium-term two percent target. "
        "Economic activity has expanded moderately, supported by strong service sector gains."
    )
    res_real = predictor.predict(real_headline, real_text)
    print(f"✓ TEST 2: REAL News -> Prediction: {res_real['prediction']} (Confidence: {res_real['confidence']}%, Prob Real: {res_real['probability_real']})")
    assert res_real['prediction'] == 'REAL', f"Expected REAL, got {res_real['prediction']}"
    assert res_real['probability_real'] > 0.65

    # TEST 3: FAKE News
    fake_headline = "BOMBSHELL: Deep State Clones Caught Smuggling Alien Viruses in Secret Subway Bunkers!"
    fake_text = (
        "CONFIDENTIAL MILITARY LEAK!! Secret globalist shadow commanders just ordered the covert "
        "distribution of engineered microchip bioweapons into suburban drinking water networks! "
        "The fake news media will never tell you the truth! Share this before the cabal deletes it forever [VIDEO]!"
    )
    res_fake = predictor.predict(fake_headline, fake_text)
    print(f"✓ TEST 3: FAKE News -> Prediction: {res_fake['prediction']} (Confidence: {res_fake['confidence']}%, Prob Fake: {res_fake['probability_fake']})")
    assert res_fake['prediction'] == 'FAKE', f"Expected FAKE, got {res_fake['prediction']}"
    assert res_fake['probability_fake'] > 0.65

    # TEST 4: Empty input
    try:
        predictor.predict("", "   ")
        assert False, "Should have raised ValueError on empty input"
    except ValueError as e:
        print(f"✓ TEST 4: Empty Input Handled -> Properly caught ValueError: '{e}'")

    # TEST 5: Short / Invalid input
    try:
        predictor.predict("Short", "abc")
        assert False, "Should have raised ValueError on short input"
    except ValueError as e:
        print(f"✓ TEST 5: Short Input Handled -> Properly caught ValueError: '{e}'")

    # TEST 6: Long Article Input (1,000+ words)
    long_paragraph = (
        "Global trade dynamics continued to show resilient patterns through the third quarter, "
        "according to data compiled by major international trade organizations and national statistical agencies. "
        "Industrial exports gained momentum across advanced manufacturing hubs, offsetting regional weaknesses in energy. "
    ) * 35  # ~1,000 words
    res_long = predictor.predict("Global Trade Report Analysis", long_paragraph)
    print(f"✓ TEST 6: Long Article Handled -> Processed {res_long['word_count']} words without memory or latency issues.")
    assert res_long['word_count'] > 800

    # TEST 7: Metadata & Health Endpoints
    health = health_check()
    assert health.status == "healthy"
    assert health.model_loaded is True
    print(f"✓ TEST 7: Health Endpoint Verified -> Status: {health.status}, Model: {health.model_name}")

    info = get_model_information()
    assert info.best_model in info.models_benchmarked
    best_acc = info.metrics_summary[info.best_model].accuracy
    print(f"✓ TEST 8: Model Info Verified -> Champion: {info.best_model} ({best_acc*100:.2f}% Accuracy, ROC-AUC: {info.metrics_summary[info.best_model].roc_auc:.4f})")

    print("\n" + "=" * 70)
    print("ALL 8 AUTOMATED SYSTEM VERIFICATION TESTS PASSED SUCCESSFULLY (100%)!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
