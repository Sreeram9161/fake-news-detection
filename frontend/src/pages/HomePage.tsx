import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Cpu, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  BarChart2
} from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Background ambient decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-500/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Project Subtitle Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs sm:text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>AI-Powered News Authenticity Classification</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
          <span className="text-slate-400">WELFake IEEE 2021 Corpus</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Can You Trust <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
            What You Read?
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Evaluate news articles and breaking headlines with high-precision machine learning. 
          Powered by TF-IDF text vectorization and calibrated Linear Support Vector Classification 
          trained on over 72,000 peer-reviewed articles.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/detector"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-xl shadow-sky-500/25 transition-all flex items-center justify-center gap-2 text-base group"
          >
            <span>Start Analysing</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/model-info"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 text-base"
          >
            <BarChart2 className="w-5 h-5 text-sky-400" />
            <span>Explore Model Metrics</span>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-3xl font-extrabold text-white">72,134</div>
            <div className="text-xs font-medium text-slate-400 mt-1">WELFake Articles Analyzed</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-3xl font-extrabold text-sky-400">95.90%</div>
            <div className="text-xs font-medium text-slate-400 mt-1">Linear SVM Test Accuracy</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-3xl font-extrabold text-indigo-400">3 Models</div>
            <div className="text-xs font-medium text-slate-400 mt-1">Benchmarked Rigorously</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-3xl font-extrabold text-emerald-400">&lt; 50ms</div>
            <div className="text-xs font-medium text-slate-400 mt-1">FastAPI Inference Time</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-sky-400 uppercase">Architecture Pipeline</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How The Authenticity Classifier Works
          </p>
          <p className="mt-3 text-sm text-slate-400">
            A standard academic Machine Learning pipeline connecting text ingestion to mathematical vectorization and calibrated probability inference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="relative p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 font-bold text-lg group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Input Ingestion</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Accepts breaking news headlines, full article bodies, or social media statements for automated verification.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-5 font-bold text-lg group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Text Normalization</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Removes HTML artifacts, URL noise, special characters, and strips case variations while preserving vocabulary context.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 font-bold text-lg group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">TF-IDF Vectorization</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Transforms cleaned text into 10,000 sublinear TF-IDF features capturing both unigrams and significant informative bigrams.
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 font-bold text-lg group-hover:scale-110 transition-transform">
              04
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Calibrated Inference</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              The calibrated Linear SVM model outputs the REAL or FAKE prediction alongside probabilistic confidence distributions.
            </p>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-sky-400 uppercase">Core Capabilities</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Designed for Academic Rigor & Production Utility
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multi-Algorithm Benchmark</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Compares Logistic Regression, Multinomial Naive Bayes, and Linear SVM on identical isolated test partitions to select the highest-performing pipeline.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Calibrated Confidence</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Features Platt calibration via CalibratedClassifierCV, providing genuine probability scores for both Real and Fake classes rather than opaque binary labels.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Real Model Integration</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Direct connection between modern React 19 / TypeScript frontend and a high-performance Python FastAPI backend. No hardcoded or simulated mock predictions.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Integrity & Disclaimer Card */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Important Verification Disclaimer</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Machine learning classifiers analyze lexical distributions, tone markers, and stylistic conventions learned from historical data. 
              The system's prediction indicates textual likelihood of authenticity and does not replace empirical investigative journalism or primary source confirmation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
