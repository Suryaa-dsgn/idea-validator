import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  // Also check localStorage directly for token as fallback
  const token = localStorage.getItem('token');
  const hasToken = !!token;

  // If loading, you could render a spinner
  if (loading && !hasToken) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  // If not authenticated and no token, redirect to login
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" />;
  }
  
  // If authenticated or has token, render the child routes
  return <Outlet />;
};

export default PrivateRoute; 