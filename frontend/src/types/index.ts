export interface PredictionRequest {
  headline?: string;
  article_text: string;
}

export interface PredictionResponse {
  prediction: 'REAL' | 'FAKE';
  label: number;
  confidence: number;
  probability_real: number;
  probability_fake: number;
  risk_level: 'Low' | 'Moderate' | 'High';
  word_count: number;
  char_count: number;
  headline_submitted: string;
  article_preview: string;
  analysis_summary: string;
  model_used: string;
  disclaimer: string;
}

export interface AlgorithmMetric {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc?: number;
  train_time_sec?: number;
  confusion_matrix: number[][];
}

export interface ModelInfoResponse {
  dataset_name: string;
  dataset_source: string;
  dataset_citation: string;
  total_records_analyzed: number;
  cleaned_records: number;
  train_samples: number;
  test_samples: number;
  class_mapping: Record<string, string>;
  features_used: string[];
  vectorizer: string;
  best_model: string;
  models_benchmarked: string[];
  metrics_summary: Record<string, AlgorithmMetric>;
  trained_timestamp: string;
  limitations: string[];
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  model_name?: string;
  version: string;
  timestamp: string;
}
