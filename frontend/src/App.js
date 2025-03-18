import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// Comment out PrivateRoute import
// import PrivateRoute from './components/routing/PrivateRoute';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';

// Empty placeholder component for landing page
// This will let your original HTML landing page show through
const EmptyLanding = () => <div style={{ display: 'none' }}></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<EmptyLanding />} />
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
}

export default App; 