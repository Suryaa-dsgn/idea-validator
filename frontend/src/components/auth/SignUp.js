import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaLockOpen } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import './AuthForms.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { name, email, password, confirmPassword } = formData;
  
  const { register, isAuthenticated, error: authError, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle redirect after signup
  const handleRedirectAfterSignup = () => {
    // Check if there's a redirect path in the URL
    const params = new URLSearchParams(location.search);
    const returnTo = params.get('return_to');
    const action = params.get('action');
    
    if (returnTo === 'dashboard') {
      navigate('/dashboard');
    } else if (returnTo === 'contact') {
      navigate('/#contact');
    } else {
      navigate('/dashboard');
    }
  };

  // Redirect if logged in
  useEffect(() => {
    if (isAuthenticated) {
      handleRedirectAfterSignup();
    }
  }, [isAuthenticated]);

  // Clear errors when unmounting
  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!name) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // DEVELOPMENT MODE: Skip real API call and simulate successful registration
      console.log('Development mode: Simulating successful registration');
      
      // Store user data in localStorage
      const mockUser = { name, email, id: 'dev-user-123' };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'dev-token-123456');
      
      // Simulate successful registration
      setTimeout(() => {
        setSuccess('Registration successful!');
        setIsLoading(false);
        
        // Redirect after a brief delay
        setTimeout(() => {
          handleRedirectAfterSignup();
        }, 1000);
      }, 800);
      
      /* Comment out actual API call for now
      const response = await register({ name, email, password });
      setSuccess('Registration successful!');
      handleRedirectAfterSignup();
      */
    } catch (error) {
      setError(error.toString());
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-logo">
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
            <img src="/images/logo.svg" alt="IdeaValidator Logo" />
          </a>
        </div>
        
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join IdeaValidator to validate your startup ideas</p>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Enter your full name"
                className={formErrors.name ? 'error' : ''}
              />
            </div>
            {formErrors.name && <div className="error-message">{formErrors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter your email"
                className={formErrors.email ? 'error' : ''}
              />
            </div>
            {formErrors.email && <div className="error-message">{formErrors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Create a password"
                className={formErrors.password ? 'error' : ''}
              />
            </div>
            {formErrors.password && <div className="error-message">{formErrors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <FaLockOpen className="input-icon" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                placeholder="Confirm your password"
                className={formErrors.confirmPassword ? 'error' : ''}
              />
            </div>
            {formErrors.confirmPassword && (
              <div className="error-message">{formErrors.confirmPassword}</div>
            )}
          </div>
          
          <div className="terms-privacy">
            <input 
              type="checkbox" 
              id="termsAgreed" 
              name="termsAgreed" 
              required 
            />
            <label htmlFor="termsAgreed">
              By signing up, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
            </label>
          </div>
          
          <button type="submit" className="btn-auth" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-alternate">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
      
      <div className="auth-image">
        <img src="/assets/signup-illustration.svg" alt="Sign Up" />
      </div>
    </div>
  );
};

export default SignUp; 