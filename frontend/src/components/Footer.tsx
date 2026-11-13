import React from 'react';
import { ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                VERITAS<span className="text-sky-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              An academic machine learning application for classifying news authenticity. 
              Trained on the peer-reviewed WELFake dataset (IEEE 2021) using TF-IDF vectorization 
              and calibrated Linear Support Vector Classification.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Machine Learning Final Project &bull; Academic Portfolio</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-sky-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/detector" className="hover:text-sky-400 transition-colors">News Authenticity Detector</Link>
              </li>
              <li>
                <Link to="/model-info" className="hover:text-sky-400 transition-colors">Benchmark & Model Metrics</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-sky-400 transition-colors">About & Methodology</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech Stack */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              Core Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">FastAPI</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">Scikit-Learn</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">React 19</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">TypeScript</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">Tailwind CSS</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300">WELFake Dataset</span>
            </div>
          </div>
        </div>

        {/* Academic Disclaimer Box */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-8 text-xs text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Academic & Research Disclaimer
          </p>
          This system produces probabilistic algorithmic predictions based on statistical linguistic representations (TF-IDF n-grams) 
          and stylistic text structure. It does not perform live journalistic investigation or claim retrieval. Predictions should not 
          replace authoritative journalism or primary source cross-verification.
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Fake News Detection System. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Built with care for Machine Learning Final Evaluation</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
