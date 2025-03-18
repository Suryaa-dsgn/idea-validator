import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { forgotPassword } from '../../api/auth';
import './AuthForms.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onChange = e => {
    setEmail(e.target.value);
    setError(null);
  };
  
  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setError('Invalid email address');
      return false;
    }
    return true;
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    if (validateEmail()) {
      setIsSubmitting(true);
      setError(null);
      
      try {
        await forgotPassword(email);
        setSuccess(true);
      } catch (err) {
        setError(err.toString());
        console.error('Error in forgot password:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Email Sent</h2>
            <p>Check your inbox for password reset instructions</p>
          </div>
          
          <div className="success-message">
            <p>We've sent an email to <strong>{email}</strong> with instructions to reset your password.</p>
            <p>If you don't see it soon, please check your spam folder.</p>
          </div>
          
          <div className="auth-footer">
            <Link to="/login">Return to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Forgot Password</h2>
          <p>Enter your email to receive reset instructions</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={onChange}
                className={error ? 'error' : ''}
              />
            </div>
            {error && error.includes('email') && <div className="error-message">{error}</div>}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div className="auth-footer">
          Remembered your password? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 