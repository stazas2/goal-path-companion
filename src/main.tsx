
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n';
import * as Sentry from '@sentry/react';

// Initialize Sentry monitoring with minimal configuration
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [],
  tracesSampleRate: 0.2, // Lower sampling rate to reduce overhead
});

createRoot(document.getElementById("root")!).render(<App />);
