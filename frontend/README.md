# Fake News Detection - Frontend Application

Modern React 19 + TypeScript single-page application styled with Tailwind CSS v4.

## Features
- **Real-Time Classification Dashboard**: Interactive headline and full-text input with live word and character counters.
- **Calibrated Probability Visualization**: Visual confidence meters comparing Genuine vs Fabricated likelihood.
- **Model Evaluation Explorer**: Live comparative benchmark tables and confusion matrix cards for all three machine learning algorithms.
- **Sample Testing**: One-click sample loaders for immediate testing with genuine and fake news text.

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Running the Frontend
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will run at `http://localhost:5173` and connect to the FastAPI backend at `http://127.0.0.1:8000`.
