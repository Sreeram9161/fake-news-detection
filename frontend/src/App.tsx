import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DetectorPage } from './pages/DetectorPage';
import { ResultsPage } from './pages/ResultsPage';
import { ModelInfoPage } from './pages/ModelInfoPage';
import { AboutPage } from './pages/AboutPage';
import type { PredictionResponse } from './types';

export const App: React.FC = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(() => {
    const saved = sessionStorage.getItem('veritas_last_prediction');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const handlePredictionComplete = (result: PredictionResponse) => {
    setPredictionResult(result);
    sessionStorage.setItem('veritas_last_prediction', JSON.stringify(result));
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/detector"
              element={<DetectorPage onPredictionComplete={handlePredictionComplete} />}
            />
            <Route
              path="/results"
              element={<ResultsPage result={predictionResult} />}
            />
            <Route path="/model-info" element={<ModelInfoPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
