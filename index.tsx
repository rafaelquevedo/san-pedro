
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// En esta versión "No-Build", usamos el ReactDOM cargado globalmente
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = (window as any).ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
