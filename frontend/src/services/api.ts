import axios from 'axios';
import type { PredictionRequest, PredictionResponse, ModelInfoResponse, HealthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await client.get<HealthResponse>('/health');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ||
        'Unable to connect to ML Backend server. Please verify FastAPI is running on port 8000.'
      );
    }
    throw error;
  }
};

export const predictNews = async (payload: PredictionRequest): Promise<PredictionResponse> => {
  try {
    const response = await client.post<PredictionResponse>('/predict', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail;
      if (typeof detail === 'string') {
        throw new Error(detail);
      } else if (Array.isArray(detail)) {
        throw new Error(detail.map(d => d.msg).join(', '));
      }
      throw new Error('Failed to get prediction from model service.');
    }
    throw error;
  }
};

export const getModelInfo = async (): Promise<ModelInfoResponse> => {
  try {
    const response = await client.get<ModelInfoResponse>('/model-info');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch model metadata.');
    }
    throw error;
  }
};

export const getGraphUrl = (filename: string): string => {
  return `${API_BASE_URL}/static/graphs/${filename}`;
};
