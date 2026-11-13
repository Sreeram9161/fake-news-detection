import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Database, 
  Cpu, 
  Layers, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  Activity,
  FileCode,
  BookOpen
} from 'lucide-react';
import { getModelInfo } from '../services/api';
import type { ModelInfoResponse } from '../types';

export const ModelInfoPage: React.FC = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await getModelInfo();
        setModelInfo(data);
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve model information from backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold mb-3 border border-sky-500/20">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Academic Performance & Benchmarks</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Machine Learning Architecture & Metrics
          </h1>
          <p className="mt-3 text-base text-slate-400 leading-relaxed">
            Empirical benchmark evaluation comparing three classical classification algorithms trained on the peer-reviewed WELFake corpus.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Loading benchmark metrics from backend...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-center">
            <p className="font-semibold">Unable to load live metadata from FastAPI server</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : modelInfo && (
          <>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-sky-400" />
                  Dataset Size
                </span>
                <span className="text-2xl font-extrabold text-white mt-1 block">
                  {modelInfo.total_records_analyzed.toLocaleString()} Articles
                </span>
                <span className="text-xs text-slate-500 mt-1 block">WELFake 2021 Corpus</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Selected Champion
                </span>
                <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
                  {modelInfo.best_model}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Highest F1-Score & Accuracy</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                  Test Accuracy
                </span>
                <span className="text-2xl font-extrabold text-white mt-1 block">
                  {((modelInfo.metrics_summary[modelInfo.best_model]?.accuracy || 0) * 100).toFixed(2)}%
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Held-out 20% test split</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Vocabulary Space
                </span>
                <span className="text-2xl font-extrabold text-indigo-400 mt-1 block">
                  10,000 N-Grams
                </span>
                <span className="text-xs text-slate-500 mt-1 block">Sublinear TF-IDF features</span>
              </div>
            </div>

            {/* Model Comparison Table */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-sky-400" />
                    Comparative Model Evaluation Benchmark
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Results calculated on {modelInfo.test_samples.toLocaleString()} held-out test articles using stratified 80/20 partitioning.
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 self-start sm:self-auto font-mono">
                  Random State: 42
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Algorithm</th>
                      <th className="py-3 px-4">Accuracy</th>
                      <th className="py-3 px-4">Precision (Weighted)</th>
                      <th className="py-3 px-4">Recall (Weighted)</th>
                      <th className="py-3 px-4">F1-Score</th>
                      <th className="py-3 px-4">ROC-AUC</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm font-medium">
                    {Object.entries(modelInfo.metrics_summary).map(([name, m]) => {
                      const isChampion = name === modelInfo.best_model;
                      return (
                        <tr
                          key={name}
                          className={`transition-colors ${
                            isChampion ? 'bg-sky-500/10 text-white' : 'hover:bg-slate-800/40 text-slate-300'
                          }`}
                        >
                          <td className="py-4 px-4 font-bold flex items-center gap-2">
                            {isChampion && <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />}
                            <span>{name}</span>
                          </td>
                          <td className="py-4 px-4 font-mono">{(m.accuracy * 100).toFixed(2)}%</td>
                          <td className="py-4 px-4 font-mono">{(m.precision * 100).toFixed(2)}%</td>
                          <td className="py-4 px-4 font-mono">{(m.recall * 100).toFixed(2)}%</td>
                          <td className="py-4 px-4 font-mono font-bold text-sky-400">{(m.f1_score * 100).toFixed(2)}%</td>
                          <td className="py-4 px-4 font-mono">{m.roc_auc ? (m.roc_auc).toFixed(4) : 'N/A'}</td>
                          <td className="py-4 px-4">
                            {isChampion ? (
                              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                                Selected Best
                              </span>
                            ) : (
                              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">
                                Candidate
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Confusion Matrices Visual Grid */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Confusion Matrices (Held-out Test Evaluation)
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  True Positives, False Positives, True Negatives, and False Negatives breakdown across each benchmarked algorithm.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(modelInfo.metrics_summary).map(([name, m]) => {
                  const cm = m.confusion_matrix;
                  return (
                    <div key={name} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{name}</span>
                        <span className="text-xs font-mono text-sky-400">Acc: {(m.accuracy * 100).toFixed(1)}%</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="p-3 rounded-xl bg-blue-900/30 border border-blue-500/20">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">True Real (TN)</span>
                          <span className="text-lg font-extrabold text-blue-300 font-mono">{cm[0][0].toLocaleString()}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">False Fake (FP)</span>
                          <span className="text-lg font-bold text-rose-300 font-mono">{cm[0][1].toLocaleString()}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">False Real (FN)</span>
                          <span className="text-lg font-bold text-rose-300 font-mono">{cm[1][0].toLocaleString()}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-500/20">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">True Fake (TP)</span>
                          <span className="text-lg font-extrabold text-emerald-300 font-mono">{cm[1][1].toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                        <span>Ground Truth vs Predicted</span>
                        <span>Total: {(cm[0][0] + cm[0][1] + cm[1][0] + cm[1][1]).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dataset Provenance & Preprocessing Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sky-400" />
                  Dataset Provenance & Citation
                </h3>
                <div className="text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    <strong>Corpus:</strong> {modelInfo.dataset_name}
                  </p>
                  <p>
                    <strong>Source Publication:</strong> {modelInfo.dataset_source}
                  </p>
                  <p>
                    <strong>Citation:</strong> <em>{modelInfo.dataset_citation}</em>
                  </p>
                  <p className="text-slate-400 pt-2 border-t border-slate-800">
                    Aggregated from verified journalistic repositories and debunked misinformation sets with balanced 50/50 prior distributions.
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-indigo-400" />
                  Pipeline Feature Engineering
                </h3>
                <div className="text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    <strong>Inputs Combined:</strong> Headline + Full Article text
                  </p>
                  <p>
                    <strong>Regex Normalization:</strong> Strips HTML tags, web URLs, emails, and punctuation.
                  </p>
                  <p>
                    <strong>Vectorization:</strong> {modelInfo.vectorizer}
                  </p>
                  <p>
                    <strong>Class Encoding:</strong> 0 = REAL, 1 = FAKE
                  </p>
                </div>
              </div>
            </div>

            {/* Model Limitations Notice Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                Documented Academic Limitations
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed list-disc list-inside">
                {modelInfo.limitations.map((lim, idx) => (
                  <li key={idx} className="marker:text-amber-400">
                    <span className="text-slate-200 font-medium">{lim.split(':')[0]}:</span>
                    <span>{lim.split(':')[1]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
