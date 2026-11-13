"""
Fake News Detection System - Model Training & Evaluation Pipeline
Dataset: WELFake (Word Embedding-based and Linguistic Feature Assessment for Fake News Detection)
Published in: IEEE Transactions on Computational Social Systems (2021)
Authors: P. K. Verma, P. Agrawal, I. Amorim, R. Prodan
"""

import os
import sys
import time
import json
import re
import argparse
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    roc_curve,
    auc
)
import joblib

# Set visualization style
sns.set_theme(style="whitegrid", palette="muted")
plt.rcParams.update({'font.sans-serif': 'DejaVu Sans', 'font.size': 11})

def clean_text(text: str) -> str:
    """Clean and normalize raw text."""
    if not isinstance(text, str):
        return ""
    # Lowercase
    text = text.lower()
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
    # Remove non-alphabetical characters (retain letters and spaces)
    text = re.sub(r'[^a-z\s]', ' ', text)
    # Collapse multiple whitespaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def run_eda(df_raw: pd.DataFrame, df_clean: pd.DataFrame, graphs_dir: str):
    """Generate and save comprehensive Exploratory Data Analysis figures."""
    print("  [EDA] Generating Real vs Fake distribution plot...", flush=True)
    os.makedirs(graphs_dir, exist_ok=True)
    
    # 1. Real vs Fake Distribution
    fig, ax = plt.subplots(figsize=(8, 5))
    counts = df_clean['label_name'].value_counts()
    colors = ['#2563eb', '#dc2626'] # Navy/Blue for Real, Crimson for Fake
    bars = ax.bar(counts.index, counts.values, color=colors, width=0.5, edgecolor='#1e293b', linewidth=1.2)
    ax.set_title("Real vs Fake News Distribution (WELFake Dataset)", fontsize=14, fontweight='bold', pad=15)
    ax.set_ylabel("Number of Articles", fontsize=12)
    ax.set_ylim(0, max(counts.values) * 1.15)
    
    for bar in bars:
        height = bar.get_height()
        pct = (height / len(df_clean)) * 100
        ax.annotate(f'{height:,}\n({pct:.1f}%)',
                    xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 4), textcoords="offset points",
                    ha='center', va='bottom', fontsize=11, fontweight='bold')
    
    plt.tight_layout()
    fig.savefig(os.path.join(graphs_dir, "real_vs_fake_distribution.png"), dpi=300)
    plt.close()

    # 2. Missing Value Analysis
    print("  [EDA] Generating Missing Values chart...", flush=True)
    missing = df_raw.isnull().sum()
    fig, ax = plt.subplots(figsize=(8, 5))
    bars = ax.bar(missing.index, missing.values, color='#0284c7', edgecolor='#0369a1', width=0.5)
    ax.set_title("Missing Values Count Across Raw Dataset Columns", fontsize=14, fontweight='bold', pad=15)
    ax.set_ylabel("Missing Count", fontsize=12)
    ax.set_ylim(0, max(missing.values) * 1.25 if max(missing.values) > 0 else 10)
    
    for bar in bars:
        h = bar.get_height()
        pct = (h / len(df_raw)) * 100
        ax.annotate(f'{h:,}\n({pct:.2f}%)',
                    xy=(bar.get_x() + bar.get_width() / 2, h),
                    xytext=(0, 4), textcoords="offset points",
                    ha='center', va='bottom', fontsize=10)
        
    plt.tight_layout()
    fig.savefig(os.path.join(graphs_dir, "missing_values_analysis.png"), dpi=300)
    plt.close()

    # 3. Text Length Distribution
    print("  [EDA] Generating Text Length distribution plot...", flush=True)
    fig, ax = plt.subplots(figsize=(10, 5))
    df_clean['word_count'] = df_clean['content'].apply(lambda x: len(x.split()))
    
    q95 = int(df_clean['word_count'].quantile(0.95))
    filtered_df = df_clean[df_clean['word_count'] <= max(q95, 600)]
    
    sns.histplot(data=filtered_df, x='word_count', hue='label_name', kde=True,
                 palette={'REAL': '#2563eb', 'FAKE': '#dc2626'}, bins=35, ax=ax, alpha=0.4)
    ax.set_title("Article Word Count Distribution by Class", fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel("Word Count", fontsize=12)
    ax.set_ylabel("Frequency", fontsize=12)
    plt.tight_layout()
    fig.savefig(os.path.join(graphs_dir, "text_length_distribution.png"), dpi=300)
    plt.close()

    # 4. Word Frequency Analysis (Top 12 most frequent words)
    print("  [EDA] Generating Word Frequency Analysis...", flush=True)
    from collections import Counter
    stopwords = set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
        'is', 'are', 'was', 'were', 'it', 'this', 'that', 'they', 'we', 'you', 'he', 'she', 'his',
        'her', 'their', 'from', 'as', 'be', 'have', 'has', 'had', 'not', 'what', 'which', 'who',
        'said', 'would', 'will', 'about', 'can', 'one', 'all', 'there', 'been', 'out', 'up', 'so',
        'more', 'if', 'no', 'when', 'my', 'into', 'them', 'its', 'also', 'some', 'than'
    ])
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    
    # Real words
    real_sample = df_clean[df_clean['label'] == 0]['content'].head(2000)
    real_words = [w for text in real_sample for w in text.split() if w not in stopwords and len(w) > 2]
    real_counter = Counter(real_words).most_common(12)
    words_r, counts_r = zip(*real_counter) if real_counter else ([], [])
    ax1.barh(range(len(words_r)), counts_r, color='#2563eb', edgecolor='#1e40af')
    ax1.set_yticks(range(len(words_r)))
    ax1.set_yticklabels(words_r, fontsize=11)
    ax1.invert_yaxis()
    ax1.set_title("Top Distinctive Terms in REAL News", fontsize=13, fontweight='bold')
    ax1.set_xlabel("Frequency", fontsize=11)
    
    # Fake words
    fake_sample = df_clean[df_clean['label'] == 1]['content'].head(2000)
    fake_words = [w for text in fake_sample for w in text.split() if w not in stopwords and len(w) > 2]
    fake_counter = Counter(fake_words).most_common(12)
    words_f, counts_f = zip(*fake_counter) if fake_counter else ([], [])
    ax2.barh(range(len(words_f)), counts_f, color='#dc2626', edgecolor='#991b1b')
    ax2.set_yticks(range(len(words_f)))
    ax2.set_yticklabels(words_f, fontsize=11)
    ax2.invert_yaxis()
    ax2.set_title("Top Distinctive Terms in FAKE News", fontsize=13, fontweight='bold')
    ax2.set_xlabel("Frequency", fontsize=11)
    
    plt.tight_layout()
    fig.savefig(os.path.join(graphs_dir, "word_frequency_analysis.png"), dpi=300)
    plt.close()
    print("  [EDA] All 4 EDA charts successfully generated and saved.", flush=True)

def train_and_evaluate(sample_size: int = 25000):
    dataset_path = "dataset/WELFake_Dataset.csv"
    graphs_dir = "results/graphs"
    eval_path = "results/evaluation.txt"
    model_dir = "backend/model"
    os.makedirs(graphs_dir, exist_ok=True)
    os.makedirs(model_dir, exist_ok=True)

    print("=" * 70, flush=True)
    print("FAKE NEWS DETECTION SYSTEM: MACHINE LEARNING PIPELINE", flush=True)
    print("=" * 70, flush=True)

    # -------------------------------------------------------------
    # PHASE 1: DATASET INSPECTION & COLLECTION
    # -------------------------------------------------------------
    print(f"\n[PHASE 1] Loading Dataset from '{dataset_path}'...", flush=True)
    df_raw = pd.read_csv(dataset_path)
    print(f"  Raw Dataset Shape: {df_raw.shape[0]:,} rows, {df_raw.shape[1]} columns", flush=True)
    print(f"  Columns: {df_raw.columns.tolist()}", flush=True)
    print(f"  Missing values:\n{df_raw.isnull().sum()}", flush=True)

    # -------------------------------------------------------------
    # PHASE 2: DATA PREPROCESSING
    # -------------------------------------------------------------
    print(f"\n[PHASE 2] Preprocessing Data...", flush=True)
    # Handle missing values
    df = df_raw.dropna(subset=['label']).copy()
    df['title'] = df['title'].fillna('').astype(str)
    df['text'] = df['text'].fillna('').astype(str)
    
    # Filter empty rows
    df = df[~((df['title'].str.strip() == '') & (df['text'].str.strip() == ''))]

    # Draw stratified sample first for high-performance and balanced training
    if sample_size and sample_size < len(df):
        print(f"  Drawing stratified sample of {sample_size:,} articles...", flush=True)
        half = sample_size // 2
        real_df = df[df['label'] == 0].sample(n=min(half, len(df[df['label'] == 0])), random_state=42)
        fake_df = df[df['label'] == 1].sample(n=min(half, len(df[df['label'] == 1])), random_state=42)
        df = pd.concat([real_df, fake_df]).sample(frac=1.0, random_state=42).reset_index(drop=True)

    print("  Combining headline and article body into unified content...", flush=True)
    df['raw_content'] = df['title'] + " " + df['text']
    
    # Deduplicate
    initial_len = len(df)
    df = df.drop_duplicates(subset=['raw_content'])
    print(f"  Removed {initial_len - len(df):,} duplicates. Retained {len(df):,} unique articles.", flush=True)

    # In WELFake: 0 = Real, 1 = Fake
    df['label_name'] = df['label'].map({0: 'REAL', 1: 'FAKE'})

    print("  Cleaning and normalizing text (removing HTML, URLs, symbols)...", flush=True)
    df['content'] = df['raw_content'].apply(clean_text)
    
    # Filter out empty or trivially short articles (< 5 words)
    df = df[df['content'].apply(lambda x: len(x.split()) >= 5)].reset_index(drop=True)
    print(f"  Final Processed Dataset Size: {len(df):,} articles ({df['label'].value_counts()[0]:,} REAL, {df['label'].value_counts()[1]:,} FAKE)", flush=True)

    # -------------------------------------------------------------
    # PHASE 3: EXPLORATORY DATA ANALYSIS
    # -------------------------------------------------------------
    print(f"\n[PHASE 3] Generating Exploratory Data Analysis Figures...", flush=True)
    run_eda(df_raw, df, graphs_dir)

    # -------------------------------------------------------------
    # SPLIT DATA (Prevent Data Leakage)
    # -------------------------------------------------------------
    print(f"\nSplitting Dataset (80% Train, 20% Test) with Stratification...", flush=True)
    X = df['content']
    y = df['label'] # 0 = REAL, 1 = FAKE
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"  Training Set: {len(X_train):,} samples", flush=True)
    print(f"  Testing Set:  {len(X_test):,} samples", flush=True)

    # -------------------------------------------------------------
    # PHASE 4: MODEL BUILDING & TRAINING
    # -------------------------------------------------------------
    print(f"\n[PHASE 4] Building and Training 3 Candidate Models...", flush=True)

    tfidf = TfidfVectorizer(
        max_features=10000,
        ngram_range=(1, 2),
        stop_words='english',
        sublinear_tf=True
    )

    models = {
        "Logistic Regression": Pipeline([
            ('tfidf', tfidf),
            ('clf', LogisticRegression(max_iter=1000, C=2.0, random_state=42, solver='lbfgs'))
        ]),
        "Multinomial Naive Bayes": Pipeline([
            ('tfidf', tfidf),
            ('clf', MultinomialNB(alpha=0.1))
        ]),
        "Linear SVM": Pipeline([
            ('tfidf', tfidf),
            ('clf', CalibratedClassifierCV(
                estimator=LinearSVC(C=1.0, random_state=42, max_iter=2000),
                cv=3
            ))
        ])
    }

    results = {}
    
    for name, pipeline in models.items():
        print(f"\n  --> Training {name}...", flush=True)
        t_start = time.time()
        pipeline.fit(X_train, y_train)
        train_time = time.time() - t_start
        print(f"      Trained in {train_time:.2f}s", flush=True)
        
        # Predict on Test Set
        y_pred = pipeline.predict(X_test)
        
        # Predict probabilities
        if hasattr(pipeline, "predict_proba"):
            y_prob = pipeline.predict_proba(X_test)[:, 1]
        else:
            y_prob = None
            
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average='weighted')
        rec = recall_score(y_test, y_pred, average='weighted')
        f1 = f1_score(y_test, y_pred, average='weighted')
        cm = confusion_matrix(y_test, y_pred)
        cr = classification_report(y_test, y_pred, target_names=['REAL (0)', 'FAKE (1)'], output_dict=True)
        
        results[name] = {
            "pipeline": pipeline,
            "accuracy": float(acc),
            "precision": float(prec),
            "recall": float(rec),
            "f1_score": float(f1),
            "confusion_matrix": cm.tolist(),
            "classification_report": cr,
            "train_time_sec": float(train_time),
            "y_prob": y_prob
        }
        
        print(f"      Test Results -> Accuracy: {acc*100:.2f}% | Precision: {prec*100:.2f}% | Recall: {rec*100:.2f}% | F1: {f1*100:.2f}%", flush=True)

    # -------------------------------------------------------------
    # PHASE 5: MODEL EVALUATION & VISUALIZATIONS
    # -------------------------------------------------------------
    print(f"\n[PHASE 5] Evaluating Models & Generating Comparative Plots...", flush=True)
    
    # 1. Confusion Matrix Heatmaps
    for name, data in results.items():
        cm = np.array(data["confusion_matrix"])
        fig, ax = plt.subplots(figsize=(6, 5))
        sns.heatmap(cm, annot=True, fmt=',d', cmap='Blues', ax=ax,
                    xticklabels=['REAL', 'FAKE'],
                    yticklabels=['REAL', 'FAKE'],
                    annot_kws={"size": 13, "fontweight": "bold"})
        ax.set_title(f"Confusion Matrix: {name}", fontsize=13, fontweight='bold', pad=12)
        ax.set_xlabel("Predicted Authenticity", fontsize=11, fontweight='bold')
        ax.set_ylabel("True Authenticity", fontsize=11, fontweight='bold')
        plt.tight_layout()
        safe_name = name.lower().replace(" ", "_")
        fig.savefig(os.path.join(graphs_dir, f"confusion_matrix_{safe_name}.png"), dpi=300)
        plt.close()
        
    # 2. Model Comparison Bar Chart
    fig, ax = plt.subplots(figsize=(10, 6))
    metrics = ['accuracy', 'precision', 'recall', 'f1_score']
    metric_labels = ['Accuracy', 'Precision', 'Recall', 'F1-Score']
    x = np.arange(len(metrics))
    width = 0.25
    
    model_colors = {
        "Logistic Regression": "#2563eb",
        "Multinomial Naive Bayes": "#0891b2",
        "Linear SVM": "#7c3aed"
    }
    
    for i, (name, data) in enumerate(results.items()):
        vals = [data[m] * 100 for m in metrics]
        rects = ax.bar(x + (i - 1) * width, vals, width, label=name, color=model_colors[name], edgecolor='#1e293b', linewidth=1)
        for rect in rects:
            h = rect.get_height()
            ax.annotate(f'{h:.1f}%',
                        xy=(rect.get_x() + rect.get_width() / 2, h),
                        xytext=(0, 3), textcoords="offset points",
                        ha='center', va='bottom', fontsize=9, fontweight='bold')
            
    ax.set_ylabel('Score (%)', fontsize=12, fontweight='bold')
    ax.set_title('Model Performance Benchmark on WELFake Test Dataset', fontsize=14, fontweight='bold', pad=15)
    ax.set_xticks(x)
    ax.set_xticklabels(metric_labels, fontsize=11, fontweight='bold')
    ax.set_ylim(80, 102)
    ax.legend(loc='lower right', frameon=True)
    plt.tight_layout()
    fig.savefig(os.path.join(graphs_dir, "model_comparison_metrics.png"), dpi=300)
    plt.close()

    # 3. ROC Curves
    fig, ax = plt.subplots(figsize=(8, 6))
    for name, data in results.items():
        if data["y_prob"] is not None:
            fpr, tpr, _ = roc_curve(y_test, data["y_prob"])
            roc_auc = auc(fpr, tpr)
            ax.plot(fpr, tpr, label=f"{name} (AUC = {roc_auc:.4f})", linewidth=2.2, color=model_colors[name])
            data["roc_auc"] = float(roc_auc)
            
    ax.plot([0, 1], [0, 1], 'k--', lw=1.2, alpha=0.6, label='Random Guess')
    ax.set_xlim([-0.01, 1.0])
    ax.set_ylim([0.0, 1.05])
    ax.set_xlabel('False Positive Rate', fontsize=11, fontweight='bold')
    ax.set_ylabel('True Positive Rate', fontsize=11, fontweight='bold')
    ax.set_title('Receiver Operating Characteristic (ROC) Curves', fontsize=13, fontweight='bold', pad=12)
    ax.legend(loc="lower right")
    plt.tight_layout()
    fig.savefig(os.path.join(graphs_dir, "roc_curves_comparison.png"), dpi=300)
    plt.close()

    # -------------------------------------------------------------
    # SELECT BEST MODEL
    # -------------------------------------------------------------
    best_model_name = max(results.keys(), key=lambda k: results[k]['f1_score'])
    best_pipeline = results[best_model_name]['pipeline']
    best_metrics = results[best_model_name]
    
    print("\n" + "=" * 70, flush=True)
    print(f"CHOSEN BEST MODEL: {best_model_name.upper()}", flush=True)
    print(f"  Test Accuracy:  {best_metrics['accuracy']*100:.2f}%", flush=True)
    print(f"  Test F1-Score:  {best_metrics['f1_score']*100:.2f}%", flush=True)
    print(f"  Test Precision: {best_metrics['precision']*100:.2f}%", flush=True)
    print(f"  Test Recall:    {best_metrics['recall']*100:.2f}%", flush=True)
    print("=" * 70, flush=True)

    # Save Best Model Pipeline using Joblib
    model_save_path = os.path.join(model_dir, "fake_news_pipeline.joblib")
    print(f"Saving best pipeline to '{model_save_path}'...", flush=True)
    joblib.dump(best_pipeline, model_save_path)

    # Prepare model metadata JSON (for FastAPI /model-info endpoint)
    metadata_results = {}
    for k, v in results.items():
        metadata_results[k] = {
            "accuracy": v["accuracy"],
            "precision": v["precision"],
            "recall": v["recall"],
            "f1_score": v["f1_score"],
            "roc_auc": v.get("roc_auc", 0.0),
            "train_time_sec": v["train_time_sec"],
            "confusion_matrix": v["confusion_matrix"],
            "classification_report": v["classification_report"]
        }

    model_metadata = {
        "dataset_name": "WELFake Dataset (IEEE 2021)",
        "dataset_source": "Word Embedding-based and Linguistic Feature Assessment for Fake News Detection",
        "dataset_citation": "P. K. Verma, P. Agrawal, I. Amorim, and R. Prodan (2021)",
        "total_records_analyzed": int(len(df_raw)),
        "cleaned_records": int(len(df)),
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "class_mapping": {"0": "REAL", "1": "FAKE"},
        "features_used": ["title (headline)", "text (article body)"],
        "vectorizer": "TF-IDF (10,000 features, Unigram + Bigram, Sublinear TF, English Stopwords)",
        "best_model": best_model_name,
        "models_benchmarked": list(results.keys()),
        "metrics_summary": metadata_results,
        "trained_timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

    metadata_path = os.path.join(model_dir, "model_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(model_metadata, f, indent=2)
    print(f"Saved model metadata to '{metadata_path}'.", flush=True)

    # Write evaluation.txt
    print(f"Writing evaluation report to '{eval_path}'...", flush=True)
    with open(eval_path, "w") as f:
        f.write("=" * 75 + "\n")
        f.write("FAKE NEWS DETECTION SYSTEM - MODEL EVALUATION REPORT\n")
        f.write("Academic Machine Learning Project\n")
        f.write(f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 75 + "\n\n")

        f.write("1. DATASET DETAILS\n")
        f.write("-" * 50 + "\n")
        f.write("Source: WELFake Dataset (IEEE Transactions on Computational Social Systems, 2021)\n")
        f.write(f"Total Raw Records: {len(df_raw):,}\n")
        f.write(f"Total Cleaned Records: {len(df):,}\n")
        f.write(f"Training Split: {len(X_train):,} articles (80%)\n")
        f.write(f"Testing Split:  {len(X_test):,} articles (20%)\n")
        f.write("Target Classes: 0 -> REAL News, 1 -> FAKE News\n")
        f.write("Feature Vectorization: TF-IDF (10,000 features, Unigrams + Bigrams, Sublinear TF)\n\n")

        f.write("2. MODEL PERFORMANCE BENCHMARK (ON HELD-OUT TEST DATA)\n")
        f.write("-" * 75 + "\n")
        f.write(f"{'Model Name':<28} | {'Accuracy':<10} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10}\n")
        f.write("-" * 75 + "\n")
        for name, data in results.items():
            f.write(f"{name:<28} | {data['accuracy']*100:6.2f}%    | {data['precision']*100:6.2f}%    | {data['recall']*100:6.2f}%    | {data['f1_score']*100:6.2f}%\n")
        f.write("-" * 75 + "\n\n")

        f.write(f"3. SELECTED CHAMPION MODEL: {best_model_name}\n")
        f.write("-" * 50 + "\n")
        f.write(f"The model was selected based on superior weighted F1-Score ({best_metrics['f1_score']*100:.2f}%) and Accuracy ({best_metrics['accuracy']*100:.2f}%).\n")
        f.write("Pipeline components:\n")
        f.write(f"  Step 1: TF-IDF Vectorizer (max_features=10000, ngram_range=(1,2))\n")
        f.write(f"  Step 2: Classifier: {best_pipeline.named_steps['clf']}\n\n")

        f.write("4. DETAILED CLASSIFICATION REPORTS\n")
        f.write("-" * 50 + "\n")
        for name, data in results.items():
            f.write(f"\n--- {name} ---\n")
            f.write(f"Confusion Matrix [ [TN, FP], [FN, TP] ]:\n{np.array(data['confusion_matrix'])}\n")
            cr = data['classification_report']
            f.write(f"REAL (0) -> Precision: {cr['REAL (0)']['precision']:.4f}, Recall: {cr['REAL (0)']['recall']:.4f}, F1: {cr['REAL (0)']['f1-score']:.4f}\n")
            f.write(f"FAKE (1) -> Precision: {cr['FAKE (1)']['precision']:.4f}, Recall: {cr['FAKE (1)']['recall']:.4f}, F1: {cr['FAKE (1)']['f1-score']:.4f}\n")
            f.write(f"Overall Accuracy: {data['accuracy']:.4f}\n")

        f.write("\n" + "=" * 75 + "\n")
        f.write("END OF EVALUATION REPORT\n")
        f.write("=" * 75 + "\n")

    print(f"Pipeline complete! All results saved in results/ and backend/model/.", flush=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Fake News Detection Models")
    parser.add_argument("--sample_size", type=int, default=25000, help="Number of samples to train on (default: 25000)")
    args = parser.parse_args()
    train_and_evaluate(sample_size=args.sample_size)
