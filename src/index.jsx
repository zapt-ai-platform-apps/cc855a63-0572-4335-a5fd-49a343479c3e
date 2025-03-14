import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import * as Sentry from '@sentry/browser';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Initialize Sentry for error tracking
Sentry.init({
  dsn: import.meta.env.VITE_PUBLIC_SENTRY_DSN,
  environment: import.meta.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'frontend',
      projectId: import.meta.env.VITE_PUBLIC_APP_ID,
    },
  },
});

// Add PWA support
window.progressierAppRuntimeSettings = {
  uid: import.meta.env.VITE_PUBLIC_APP_ID,
  icon512: "https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512",
  name: 'Comic Translator',
  shortName: 'Comic Translator',
};

let progressierScript = document.createElement('script');
progressierScript.setAttribute('src', 'https://progressier.app/z8yY3IKmfpDIw3mSncPh/script.js');
progressierScript.setAttribute('defer', 'true');
document.querySelector('head').appendChild(progressierScript);

// Umami Analytics
if (import.meta.env.VITE_PUBLIC_APP_ENV !== 'development') {
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://cloud.umami.is/script.js';
  script.setAttribute('data-website-id', import.meta.env.VITE_PUBLIC_UMAMI_WEBSITE_ID);
  document.head.appendChild(script);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer position="bottom-right" />
    <div className="fixed bottom-2 left-2 text-xs text-gray-500">
      <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
        Made on ZAPT
      </a>
    </div>
  </React.StrictMode>
);