import React from 'react';
import { 
  BookOpen, 
  Target, 
  Lightbulb, 
  Cpu, 
  Compass, 
  Code2, 
  CheckCircle2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold mb-3 border border-sky-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Final Project Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About the Fake News Detection System
          </h1>
          <p className="mt-3 text-base text-slate-400 leading-relaxed">
            Comprehensive overview of problem formulation, research objectives, machine learning methodology, and architectural implementation.
          </p>
        </div>

        {/* 1. Problem Statement */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">1. Problem Statement</h2>
          </div>
          <div className="text-sm text-slate-300 leading-relaxed space-y-3">
            <p>
              The exponential proliferation of unverified online publications, sensationalized clickbait, and deliberate misinformation campaigns poses a severe challenge to democratic discourse, public health guidance, and societal trust. Traditional manual fact-checking by human journalists, while essential, cannot scale at the velocity of digital viral distribution.
            </p>
            <p>
              Consequently, computational linguistics and natural language processing provide an indispensable first-line automated screening tool to flag suspicious rhetorical structures, deceptive lexical markers, and stylometric anomalies in real-time.
            </p>
          </div>
        </div>

        {/* 2. Project Objectives */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">2. Project Objectives</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-300">
                <strong>Empirical Benchmark:</strong> Compare classical machine learning algorithms (Logistic Regression, Multinomial Naive Bayes, Linear SVM) on a unified benchmark dataset.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-300">
                <strong>Calibrated Probabilities:</strong> Implement Platt scaling to provide interpretable confidence scores rather than uncalibrated binary outputs.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-300">
                <strong>Zero Data Leakage:</strong> Enforce strict Scikit-learn Pipeline encapsulation to guarantee all feature engineering happens purely on training folds.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-300">
                <strong>Full-Stack Production App:</strong> Deliver a complete, deployable web platform with asynchronous FastAPI REST endpoints and React 19 UI.
              </div>
            </div>
          </div>
        </div>

        {/* 3. Proposed Solution Architecture */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">3. Proposed Solution Architecture</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Our proposed system follows a modular, decoupled architecture:
          </p>
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-1">
                Data & Feature Layer
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Aggregates headline and article text, performs regex tokenization and cleaning, and constructs a 10,000-dimensional sparse feature space using sublinear Term Frequency-Inverse Document Frequency (TF-IDF) incorporating unigrams and contiguous bigrams.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Classification & Calibration Layer
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Applies Linear Support Vector Classification with 3-fold cross-validation calibration (<code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">CalibratedClassifierCV</code>), achieving optimal separating hyperplanes in high-dimensional text space while producing well-calibrated confidence probabilities.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                API & Presentation Layer
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Exposes standardized RESTful endpoints via FastAPI (<code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">/predict</code>, <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">/health</code>, <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">/model-info</code>) consumed by a responsive React 19 / TypeScript single-page application styled with Tailwind CSS.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Technologies Breakdown */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">4. Technologies & Tools Utilized</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Machine Learning & NLP</h3>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>&bull; Python 3.14</li>
                <li>&bull; Scikit-learn (Pipeline, TF-IDF, SVM, NB)</li>
                <li>&bull; Pandas & NumPy</li>
                <li>&bull; Joblib (Model Serialization)</li>
                <li>&bull; Matplotlib & Seaborn</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Backend Architecture</h3>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>&bull; FastAPI Framework</li>
                <li>&bull; Uvicorn ASGI Server</li>
                <li>&bull; Pydantic v2 Schema Validation</li>
                <li>&bull; RESTful API Endpoints</li>
                <li>&bull; CORS Middleware</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Frontend & User Interface</h3>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>&bull; React 19 & TypeScript</li>
                <li>&bull; Vite Build Tool</li>
                <li>&bull; Tailwind CSS v4</li>
                <li>&bull; React Router DOM v7</li>
                <li>&bull; Lucide React Icons & Axios</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. Future Roadmap & Scope */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">5. Future Enhancements & Scope</h2>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc list-inside">
            <li>
              <strong>Transformer-based Encoders:</strong> Fine-tuning contextual language models such as RoBERTa, DeBERTa, or DistilBERT for deep semantic understanding.
            </li>
            <li>
              <strong>Multimodal Verification:</strong> Incorporating reverse image search and synthetic image (deepfake) forensics alongside textual analysis.
            </li>
            <li>
              <strong>Live Retrieval-Augmented Fact Checking:</strong> Querying Wikipedia knowledge graphs and authenticated news APIs to verify factual entities in real time.
            </li>
            <li>
              <strong>Multilingual Support:</strong> Extending models to non-English languages to detect regional misinformation across diverse linguistic demographics.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
