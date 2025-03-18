import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

console.log('React script loaded and executing');

try {
  console.log('Attempting to create root element');
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found in the DOM');
    throw new Error('Root element not found');
  }
  
  console.log('Creating ReactDOM root');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('Rendering React app');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('React app rendered successfully');
  
  // Hide loading message
  if (typeof window.hideLoading === 'function') {
    window.hideLoading();
  } else {
    // Fallback if the function isn't available
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
      loadingMessage.style.display = 'none';
    }
  }
} catch (error) {
  console.error('Failed to render React application:', error);
  // Show error in the DOM
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="margin: 20px; padding: 20px; border: 1px solid #ffcccc; border-radius: 5px; background-color: #fff9f9;">
        <h1>Failed to load application</h1>
        <p>The application could not be initialized.</p>
        <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${error.toString()}</pre>
        <button onclick="window.location.reload()" style="padding: 8px 16px; background-color: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
} 