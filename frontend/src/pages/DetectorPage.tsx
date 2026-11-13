import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Newspaper, 
  Send, 
  Trash2, 
  FileText, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Loader2
} from 'lucide-react';
import { predictNews } from '../services/api';
import type { PredictionResponse } from '../types';

interface DetectorPageProps {
  onPredictionComplete: (result: PredictionResponse) => void;
}

export const DetectorPage: React.FC<DetectorPageProps> = ({ onPredictionComplete }) => {
  const [headline, setHeadline] = useState('');
  const [articleText, setArticleText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Dynamic live word and character counters
  const trimmedCombined = `${headline} ${articleText}`.trim();
  const wordCount = trimmedCombined ? trimmedCombined.split(/\s+/).length : 0;
  const charCount = articleText.length;

  // Real-world representative news samples for instant presentation demonstration
  const handleLoadSampleReal = () => {
    setErrorMessage(null);
    setHeadline('Federal Reserve Keeps Interest Rates Steady Amid Moderate Inflation');
    setArticleText(
      'WASHINGTON (Reuters) - The Federal Reserve maintained its key interest rate target on Wednesday, ' +
      'noting continued solid economic growth and persistent labor market strength, while observing that ' +
      'inflation indicators have eased over the past twelve months. In its official statement following the two-day ' +
      'Federal Open Market Committee meeting, officials signaled that borrowing costs would remain unchanged as they ' +
      'evaluate incoming economic data and employment metrics.'
    );
  };

  const handleLoadSampleFake = () => {
    setErrorMessage(null);
    setHeadline('CONFIDENTIAL LEAK: Secret Syndicate Secretly Chemically Poisoning Municipal Water Reserves!');
    setArticleText(
      'UNBELIEVABLE WHISTLEBLOWER TESTIMONY!! Shocking high-level documents were just leaked online exposing how globalist ' +
      'billionaires and underground covert agencies are intentionally poisoning urban tap water networks to manipulate public ' +
      'behavior!! The corrupt mainstream news agencies are in total panic and actively scrubbing this story from social media! ' +
      'Share this viral emergency bulletin with everyone you know before the government deletes our website permanently [SHOCKING VIDEO]!!'
    );
  };

  const handleClear = () => {
    setHeadline('');
    setArticleText('');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!articleText.trim()) {
      setErrorMessage('Article content is required. Please paste or write the article text to analyze.');
      return;
    }

    if (articleText.trim().length < 15) {
      setErrorMessage('The article content is too brief for statistical NLP analysis. Please provide at least 15 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await predictNews({
        headline: headline.trim(),
        article_text: articleText.trim(),
      });
      onPredictionComplete(response);
      navigate('/results');
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while communicating with the prediction engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold mb-3 border border-sky-500/20">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Interactive Authenticity Detector</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Analyse News Content
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
            Input a news headline, statement, or complete body paragraph. The machine learning model will extract linguistic features to estimate authenticity.
          </p>
        </div>

        {/* Quick Demo Pre-fill Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Test with Benchmark Samples:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSampleReal}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-all font-medium flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Genuine News Sample</span>
            </button>
            <button
              type="button"
              onClick={handleLoadSampleFake}
              className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-all font-medium flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              <span>Fake News Sample</span>
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Validation Notice</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Main Detector Form Card */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
          {/* Headline Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="headline" className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>News Headline / Title</span>
              </label>
              <span className="text-xs text-slate-500">(Optional but recommended)</span>
            </div>
            <input
              id="headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Health Ministry Approves New Treatment Protocol for Seasonal Flu"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
            />
          </div>

          {/* Article Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="articleText" className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <Newspaper className="w-4 h-4 text-sky-400" />
                <span>Full Article Content or Statement</span>
                <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{wordCount} words</span>
                <span>&bull;</span>
                <span>{charCount} chars</span>
              </div>
            </div>
            <textarea
              id="articleText"
              rows={8}
              value={articleText}
              onChange={(e) => setArticleText(e.target.value)}
              placeholder="Paste the full body text of the news article here for comprehensive lexical and stylistic feature analysis..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all leading-relaxed resize-y min-h-[160px]"
            />
          </div>

          {/* Guidance note */}
          <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
            <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              For best accuracy, provide complete sentences rather than isolated keywords. The TF-IDF vectorizer evaluates both unigram vocabulary and bigram syntactic structures.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClear}
              disabled={loading || (!headline && !articleText)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Inputs</span>
            </button>

            <button
              type="submit"
              disabled={loading || !articleText.trim()}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating with ML Pipeline...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Analyse News Authenticity</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
