import { useState } from 'react';
import { predictNews } from '../services/api';
import type { PredictionRequest, PredictionResponse } from '../types';

export const useNewsDetection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const detect = async (payload: PredictionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictNews(payload);
      setResult(data);
      return data;
    } catch (err: any) {
      const msg = err.message || 'Failed to analyze text';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setResult(null);
    setError(null);
  };

  return { detect, loading, error, result, clear };
};
