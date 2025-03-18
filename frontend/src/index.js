import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Add error handling to help debug production issues
console.log('React application initializing...');

// Simple error boundary component for production debugging
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          margin: '20px', 
          padding: '20px', 
          border: '1px solid #ffcccc',
          borderRadius: '5px',
          backgroundColor: '#fff9f9'
        }}>
          <h1>Something went wrong</h1>
          <p>The application encountered an error. Please try again later.</p>
          <details style={{ whiteSpace: 'pre-wrap', margin: '10px 0' }}>
            <summary>Error Details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button onClick={() => window.location.reload()} style={{
            padding: '8px 16px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Try to render the app with error boundary
try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('React application rendered successfully');
} catch (error) {
  console.error('Failed to render React application:', error);
  // Fallback render for critical errors
  document.getElementById('root').innerHTML = `
    <div style="margin: 20px; padding: 20px; border: 1px solid #ffcccc; border-radius: 5px; background-color: #fff9f9;">
      <h1>Failed to load application</h1>
      <p>The application could not be initialized. Please try again later.</p>
      <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${error.toString()}</pre>
      <button onclick="window.location.reload()" style="padding: 8px 16px; background-color: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Reload Page
      </button>
    </div>
  `;
} 