import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry monitoring
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.5,
});

createRoot(document.getElementById("root")!).render(<App />);
