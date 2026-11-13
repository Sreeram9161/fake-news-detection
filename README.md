# FAKE NEWS DETECTION SYSTEM
### AI-Powered News Authenticity Classification

[![Python](https://img.shields.io/badge/Python-3.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.4+-F7931E.svg)](https://scikit-learn.org/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Accuracy](https://img.shields.io/badge/Test_Accuracy-95.90%25-brightgreen.svg)]()

---

## 📌 Project Overview
The **Fake News Detection System** is an end-to-end Machine Learning web application engineered to ingest news headlines or full-length articles and reliably classify them as **REAL** or **FAKE**. 

Developed for a **Machine Learning Final Project**, it follows a rigorous academic workflow:
1. **Empirical Dataset Grounding**: Evaluated on the peer-reviewed **WELFake** corpus (72,134 records).
2. **Strict Data Leakage Prevention**: Enforces unified `scikit-learn` Pipeline transformations on isolated training sets.
3. **Multi-Model Comparative Benchmarking**: Compares **Logistic Regression**, **Multinomial Naive Bayes**, and **Linear Support Vector Machine (Linear SVM)**.
4. **Calibrated Probability Distributions**: Uses Platt scaling (`CalibratedClassifierCV`) so the winning model produces genuine Bayesian confidence percentages for both classes.
5. **Production Full-Stack Architecture**: Connects a high-performance **FastAPI** backend to a responsive **React 19 / TypeScript / Tailwind CSS** frontend.

---

## 🏗️ System Architecture & Workflow

```mermaid
flowchart LR
    A[News Article / Headline] --> B[Text Preprocessing & Regex Cleaning]
    B --> C[TF-IDF N-Gram Vectorizer\n10,000 Features, 1-2 Grams]
    C --> D[Calibrated Linear SVM Classifier]
    D --> E[FastAPI REST Backend\n/predict, /health, /model-info]
    E --> F[React 19 + TypeScript UI\nInteractive AI Dashboard]
```

---

## 📊 Dataset Provenance (WELFake Dataset)

- **Source**: *Word Embedding-based and Linguistic Feature Assessment for Fake News Detection*
- **Publication**: **IEEE Transactions on Computational Social Systems** (2021)
- **Authors**: P. K. Verma, P. Agrawal, I. Amorim, and R. Prodan
- **Total Raw Records**: `72,134` articles
- **Input Features**: `title` (headline), `text` (body content)
- **Target Encoding**: `0` = **REAL News**, `1` = **FAKE News**
- **Balance**: Highly balanced prior distribution (35,028 Real, 37,106 Fake)

---

## 🔬 Machine Learning Evaluation & Results

All models were evaluated on an isolated **20% held-out test split (4,786 articles)** with stratified sampling (`random_state=42`).

### 1. Model Benchmark Comparison Table

| Algorithm | Accuracy | Precision (Weighted) | Recall (Weighted) | F1-Score (Weighted) | ROC-AUC | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Linear SVM (Calibrated)** | **95.90%** | **95.92%** | **95.90%** | **95.91%** | **0.9924** | 🏆 **Selected Champion** |
| **Logistic Regression** | 95.34% | 95.35% | 95.34% | 95.34% | 0.9912 | Benchmark Baseline |
| **Multinomial Naive Bayes** | 86.61% | 86.73% | 86.61% | 86.61% | 0.9548 | Probabilistic Baseline |

> **Champion Selection Justification**: **Linear SVM** with Platt calibration achieved the highest F1-Score (**95.91%**), highest Accuracy (**95.90%**), and highest ROC-AUC (**0.9924**), while maintaining balanced sensitivity across both genuine journalistic writing and deceptive misinformation.

### 2. Confusion Matrix for Champion Model (Linear SVM)
On the 4,786 test samples:
- **True Real (TN)**: `2,371`
- **False Fake (FP)**: `121`
- **False Real (FN)**: `75`
- **True Fake (TP)**: `2,219`

### 3. Generated Figures & Plots
The training script automatically computes and exports high-resolution visual plots into `results/graphs/`:
- `real_vs_fake_distribution.png`: Class balance in the WELFake dataset
- `missing_values_analysis.png`: Missing values distribution
- `text_length_distribution.png`: Word count distribution for Real vs Fake
- `word_frequency_analysis.png`: Top 12 distinctive words in Real vs Fake news
- `model_comparison_metrics.png`: Grouped comparative bar charts across all 3 models
- `roc_curves_comparison.png`: ROC Curves & AUC comparisons
- `confusion_matrix_linear_svm.png`: Heatmap confusion matrix for Linear SVM
- `confusion_matrix_logistic_regression.png`: Heatmap confusion matrix for Logistic Regression
- `confusion_matrix_multinomial_naive_bayes.png`: Heatmap confusion matrix for Naive Bayes

---

## 📁 Repository Structure

```
Fake detection/
│
├── frontend/                     # React 19 + TypeScript + Tailwind CSS UI
│   ├── src/
│   │   ├── components/           # Navbar, Footer
│   │   ├── pages/                # Home, Detector, Results, ModelInfo, About
│   │   ├── services/             # Axios API client (/predict, /health, /model-info)
│   │   ├── hooks/                # useNewsDetection custom hook
│   │   ├── types/                # TypeScript interfaces
│   │   ├── App.tsx               # Route configurations
│   │   └── main.tsx              # DOM mounting
│   ├── package.json              # Frontend npm dependencies
│   ├── vite.config.ts            # Vite + Tailwind v4 config
│   └── .env.example              # Environment variables template
│
├── backend/                      # Python FastAPI REST Backend
│   ├── app/
│   │   ├── main.py               # FastAPI application & route endpoints
│   │   ├── predictor.py          # NewsPredictor inference singleton
│   │   ├── schemas.py            # Pydantic v2 data models
│   │   └── config.py             # Server & model path configuration
│   ├── model/
│   │   ├── fake_news_pipeline.joblib  # Trained scikit-learn pipeline
│   │   └── model_metadata.json        # Empirical metrics & hyperparameters
│   ├── requirements.txt          # Python dependencies
│   └── .env.example              # Backend environment template
│
├── dataset/                      # WELFake dataset storage
│   └── WELFake_Dataset.csv       # 72,134 records (IEEE 2021)
│
├── notebooks/                    # Academic Jupyter Notebook
│   └── fake_news_detection.ipynb # Step-by-step EDA & Model Training
│
├── training/                     # Scripts & Automated Test Suite
│   ├── train_model.py            # Full ML training & graph generation script
│   └── test_suite.py             # 8-scenario end-to-end test suite
│
├── results/                      # Evaluation outputs
│   ├── graphs/                   # 9 Generated visualization charts
│   └── evaluation.txt            # Formatted evaluation report
│
├── README.md                     # Comprehensive academic documentation
└── .gitignore                    # Version control ignore rules
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
- **Python**: Version 3.10+ (tested on Python 3.14)
- **Node.js**: Version 18+ (tested on Node.js v26)

---

### Step 1: Install Backend Dependencies
Open your terminal in the project directory:

```bash
# Navigate to backend
cd backend

# Install required Python packages
pip install -r requirements.txt
```

---

### Step 2: (Optional) Retrain Machine Learning Model
The repository already contains the trained `fake_news_pipeline.joblib` and generated evaluation graphs. If you want to re-train the models from scratch:

```bash
# From the project root
python training/train_model.py --sample_size 25000
```
This generates all 9 evaluation graphs in `results/graphs/`, saves the metadata in `backend/model/model_metadata.json`, and dumps the champion model pipeline.

---

### Step 3: Run Automated Test Suite
Verify that all model components, edge cases, and inference routines are functioning:

```bash
python training/test_suite.py
```
*Expected Output:* `ALL 8 AUTOMATED SYSTEM VERIFICATION TESTS PASSED SUCCESSFULLY (100%)!`

---

### Step 4: Start the FastAPI Backend Server

```bash
# Navigate to the backend directory
cd backend

# Start the uvicorn ASGI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The FastAPI backend will start at:
- **API Base**: `http://127.0.0.1:8000`
- **Interactive Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`

---

### Step 5: Install Frontend Dependencies & Start React App
Open a **second terminal window** in the project directory:

```bash
# Navigate to frontend
cd frontend

# Install dependencies (React 19, TypeScript, Tailwind, Lucide, Axios)
npm install

# Start Vite development server
npm run dev
```

Open your browser at:
👉 **`http://localhost:5173`**

---

## 🌐 API Endpoint Specifications

### 1. `GET /health`
Verifies backend status and model readiness.
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_name": "Linear SVM",
  "version": "1.0.0",
  "timestamp": "2026-11-13 10:07:14"
}
```

### 2. `POST /predict`
Performs authenticity classification on provided text.
**Request Body:**
```json
{
  "headline": "Federal Reserve Maintains Key Interest Rates",
  "article_text": "WASHINGTON (Reuters) - The Federal Reserve held benchmark interest rates steady on Wednesday amid moderate economic growth..."
}
```

**Response Body:**
```json
{
  "prediction": "REAL",
  "label": 0,
  "confidence": 99.29,
  "probability_real": 0.9929,
  "probability_fake": 0.0071,
  "risk_level": "Low",
  "word_count": 21,
  "char_count": 137,
  "headline_submitted": "Federal Reserve Maintains Key Interest Rates",
  "article_preview": "WASHINGTON (Reuters) - The Federal Reserve held benchmark interest rates steady on Wednesday amid moderate economic growth...",
  "analysis_summary": "The text exhibits linguistic and stylistic consistency commonly observed in verified, factual reporting...",
  "model_used": "Linear SVM",
  "disclaimer": "Notice: This prediction is generated by a statistical machine learning model trained on historical news corpora..."
}
```

### 3. `GET /model-info`
Returns complete academic metadata, dataset citation, algorithm comparison metrics, and documented limitations.

---

## 🖥️ Frontend Web Application Pages

1. **Home Page (`/`)**:
   - Hero header: *"Can You Trust What You Read?"*
   - Interactive pipeline architecture diagram
   - Live statistics banner (72,134 dataset items, 95.90% Accuracy, <50ms response)
   - Call to action buttons to immediately start analysis or inspect metrics
2. **News Detector Page (`/detector`)**:
   - Inputs for Headline and Article content
   - Live word and character counters
   - **One-click demo sample buttons**: *"Genuine News Sample"* and *"Fake News Sample"* for seamless live presentations
   - Loading state animation with error handling
3. **Results Page (`/results`)**:
   - High-impact REAL / FAKE verdict banner
   - Visual probability distribution meter (Real % vs Fake %)
   - Risk level indicator (Low / Moderate / High)
   - Machine learning linguistic explanation
   - Text characteristics breakdown and prominent academic disclaimer
4. **Model Information Page (`/model-info`)**:
   - Dynamic comparison table across Logistic Regression, Naive Bayes, and Linear SVM
   - Interactive confusion matrix cards for each algorithm
   - Dataset provenance, features engineering, and documented limitations
5. **About Project Page (`/about`)**:
   - Problem statement on digital misinformation
   - Formal project objectives and proposed solution
   - Complete technology stack breakdown
   - Future roadmap (BERT, multimodal analysis, live claim retrieval)

---

## ⚖️ Academic & Ethical Disclaimer
This project is formulated for academic research and evaluation purposes. The system evaluates statistical linguistic characteristics, stylometry, and vocabulary n-grams learned from historical training corpora. It **does not** execute real-time investigative journalism or live fact retrieval. Machine learning predictions should serve as an assistive screening indicator and should never replace primary source fact verification.

---

## 👨‍💻 Project Evaluation Credits
- **Project Title**: Fake News Detection System
- **Subtitle**: AI-Powered News Authenticity Classification
- **Domain**: Natural Language Processing & Machine Learning
- **Dataset**: WELFake (IEEE 2021)
- **Status**: Production Complete & Verified
