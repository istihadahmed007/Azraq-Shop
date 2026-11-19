import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root container element #root not found in document.');
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (err) {
  console.error('[AZRAQ Root Mount Error]:', err);
  if (typeof window !== 'undefined' && typeof window.__azraqShowBootError === 'function') {
    window.__azraqShowBootError(err.message || 'Fatal error mounting application');
  }
}

