import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// Comment out PrivateRoute import
// import PrivateRoute from './components/routing/PrivateRoute';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';

// Simple visible landing component instead of empty one
const SimpleLanding = () => (
  <div style={{ 
    padding: '40px', 
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  }}>
    <h1>Welcome to IdeaValidator</h1>
    <p>Use the links below to access the authentication pages:</p>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '20px',
      margin: '30px 0' 
    }}>
      <a 
        href="/login" 
        style={{
          padding: '10px 20px',
          backgroundColor: '#4f46e5',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}
      >
        Login
      </a>
      <a 
        href="/signup" 
        style={{
          padding: '10px 20px',
          backgroundColor: '#4f46e5',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}
      >
        Sign Up
      </a>
    </div>
  </div>
);

// Fallback component in case of errors
const ErrorFallback = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2>Something went wrong</h2>
    <p>Sorry, we're having trouble loading this page.</p>
    <button 
      onClick={() => window.location.reload()}
      style={{
        padding: '10px 20px',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px'
      }}
    >
      Try Again
    </button>
  </div>
);

function App() {
  try {
    return (
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<SimpleLanding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Make Dashboard directly accessible */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Redirect to home by default */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    );
  } catch (error) {
    console.error("Error rendering App:", error);
    return <ErrorFallback />;
  }
}

export default App; 