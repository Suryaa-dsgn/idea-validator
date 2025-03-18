import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// Auth Pages
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';

// Route Guard Component
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Home shows the static HTML page */}
          <Route path="/" element={<EmptyLanding />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Empty component that lets the static HTML be visible
const EmptyLanding = () => {
  React.useEffect(() => {
    // Show the static fallback content
    const staticContent = document.getElementById('static-fallback');
    if (staticContent) {
      staticContent.style.display = 'block';
    }

    return () => {
      // Hide the static content when navigating away
      if (staticContent) {
        staticContent.style.display = 'none';
      }
    };
  }, []);

  // Return an empty div since the static content will be shown
  return <div style={{ display: 'none' }}></div>;
};

export default App; 