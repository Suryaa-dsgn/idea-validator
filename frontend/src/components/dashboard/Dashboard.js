import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  // Get user from localStorage as fallback
  const userFromStorage = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user'))
    : null;
  
  // Use either context user or localStorage user
  const displayUser = user || userFromStorage || { name: 'Guest User', email: 'guest@example.com' };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome, {displayUser.name}!</p>
      </div>
      
      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h2>You've successfully logged in!</h2>
              <p>This is your dashboard page where you'll be able to:</p>
              <ul>
                <li>Submit new ideas</li>
                <li>View your existing ideas</li>
                <li>Check validation results</li>
                <li>Manage your account</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 