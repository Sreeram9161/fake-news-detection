import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  FileText, 
  ShieldAlert, 
  HelpCircle, 
  RotateCcw,
  Sparkles,
  BarChart2
} from 'lucide-react';
import type { PredictionResponse } from '../types';

interface ResultsPageProps {
  result: PredictionResponse | null;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 mx-auto flex items-center justify-center">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">No Analysis Recorded</h2>
          <p className="text-sm text-slate-400">
            You haven't submitted any news text yet. Head over to the News Detector to run an authenticity assessment.
          </p>
          <Link
            to="/detector"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 font-bold text-white text-sm transition-all"
          >
            <span>Go to News Detector</span>
          </Link>
        </div>
      </div>
    );
  }

  const isReal = result.prediction === 'REAL';
  const probRealPct = (result.probability_real * 100).toFixed(1);
  const probFakePct = (result.probability_fake * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back navigation and header */}
        <div className="flex items-center justify-between">
          <Link
            to="/detector"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Analyse Another Article</span>
          </Link>

          <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono">
            Model: {result.model_used}
          </span>
        </div>

        {/* Primary Classification Verdict Banner */}
        <div
          className={`relative p-8 rounded-3xl border shadow-2xl transition-all overflow-hidden ${
            isReal
              ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-emerald-500/30'
              : 'bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border-rose-500/30'
          }`}
        >
          {/* Subtle glow accent in corner */}
          <div
            className={`absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
              isReal ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  isReal
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isReal ? <CheckCircle2 className="w-9 h-9" /> : <AlertTriangle className="w-9 h-9" />}
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Prediction Classification
                </div>
                <div className="flex items-center gap-3">
                  <h1
                    className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                      isReal ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isReal ? 'REAL NEWS' : 'FAKE NEWS'}
                  </h1>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
                      result.risk_level === 'Low'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : result.risk_level === 'Moderate'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {result.risk_level} Misinformation Risk
                  </span>
                </div>
              </div>
            </div>

            {/* Confidence Score Pill */}
            <div className="sm:text-right bg-slate-950/60 p-4 rounded-2xl border border-slate-800 shrink-0">
              <div className="text-xs text-slate-400 font-medium">Model Confidence</div>
              <div className="text-3xl font-extrabold text-white mt-0.5">
                {result.confidence.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Probability Distribution Meters */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-sky-400" />
                Calibrated Class Probabilities
              </span>
              <span className="text-slate-400">Total: 100%</span>
            </div>

            {/* Split Progress Bar */}
            <div className="w-full h-3.5 rounded-full bg-slate-950 overflow-hidden flex p-0.5 border border-slate-800">
              <div
                style={{ width: `${probRealPct}%` }}
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-l-full transition-all duration-700"
                title={`Probability Real: ${probRealPct}%`}
              />
              <div
                style={{ width: `${probFakePct}%` }}
                className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-r-full transition-all duration-700"
                title={`Probability Fake: ${probFakePct}%`}
              />
            </div>

            <div className="grid grid-cols-2 text-xs font-medium pt-1">
              <div className="text-emerald-400 flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Genuine News Likelihood: <strong>{probRealPct}%</strong></span>
              </div>
              <div className="text-rose-400 text-right flex items-center justify-end gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span>Fabricated News Likelihood: <strong>{probFakePct}%</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Explanation Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              Machine Learning Linguistic Assessment
            </h3>
            <p className="text-base text-slate-200 leading-relaxed">
              {result.analysis_summary}
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs text-slate-500 block">Total Words</span>
              <span className="text-sm font-bold text-white font-mono">{result.word_count}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs text-slate-500 block">Character Length</span>
              <span className="text-sm font-bold text-white font-mono">{result.char_count}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs text-slate-500 block">Class Encoded</span>
              <span className="text-sm font-bold text-white font-mono">{result.label} ({result.prediction})</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs text-slate-500 block">Classifier Engine</span>
              <span className="text-sm font-bold text-sky-400 truncate block">{result.model_used}</span>
            </div>
          </div>
        </div>

        {/* Submitted Text Review Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              Submitted News Text Record
            </h3>
          </div>

          {result.headline_submitted && result.headline_submitted !== 'N/A (Full text provided)' && (
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
              <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Headline</span>
              <p className="text-sm font-bold text-white">{result.headline_submitted}</p>
            </div>
          )}

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Content Excerpt</span>
            <p className="text-sm text-slate-300 leading-relaxed font-serif">
              "{result.article_preview}"
            </p>
          </div>
        </div>

        {/* Essential Academic Disclaimer */}
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-4 text-amber-200/90 text-xs sm:text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-amber-300 font-semibold block">Academic Evaluation Disclaimer</strong>
            <p className="leading-relaxed">
              {result.disclaimer}
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center pt-2">
          <Link
            to="/detector"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-500/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Analyse Another News Article</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
