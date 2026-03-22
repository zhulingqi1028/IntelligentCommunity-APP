import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <div className="max-w-md mx-auto h-[100dvh] bg-white relative overflow-hidden shadow-2xl sm:border-x sm:border-gray-200 translate-x-0">
      <App />
    </div>
  </React.StrictMode>
);