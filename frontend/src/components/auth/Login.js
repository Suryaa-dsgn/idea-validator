import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './AuthForms.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;
  
  const { login, isAuthenticated, error: authError, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const returnTo = queryParams.get('return_to');
  const action = queryParams.get('action');
  
  // Handle redirects based on query parameters
  const handleRedirectAfterLogin = () => {
    // Check if there's a return_to parameter
    if (returnTo === 'dashboard') {
      if (action === 'validate') {
        // Check if there's a pending idea
        const pendingIdea = localStorage.getItem('pendingIdea');
        if (pendingIdea) {
          navigate('/dashboard?validateIdea=true');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } else if (returnTo === 'contact') {
      // Check if there's contact form data
      const contactFormData = localStorage.getItem('contactFormData');
      if (contactFormData) {
        // Submit contact form and then navigate home
        // For now, just navigate home
        navigate('/');
      } else {
        navigate('/');
      }
    } else {
      navigate('/dashboard');
    }
  };

  // Redirect if logged in
  useEffect(() => {
    if (isAuthenticated) {
      handleRedirectAfterLogin();
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
    }

    setFormErrors(errors);
    return isValid;
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // Mock login for development
        console.log('Development mode: Simulating successful login');
        
        // Check if there's a user from signup
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        
        if (savedUser) {
          const user = JSON.parse(savedUser);
          
          // Simple check to match the email
          if (user.email.toLowerCase() === email.toLowerCase()) {
            // Set success and token
            setSuccess('Login successful!');
            
            // Ensure token exists
            if (!savedToken) {
              localStorage.setItem('token', 'dev-token-123456');
            }
            
            // Force navigation directly rather than waiting for context update
            setTimeout(() => {
              // Use direct window location change instead of navigate hook
              window.location.href = '/dashboard';
            }, 1000);
          } else {
            setError('Invalid email or password');
          }
        } else {
          // No user found - create one for development purposes
          const mockUser = { name: 'Test User', email, id: 'dev-user-123' };
          localStorage.setItem('user', JSON.stringify(mockUser));
          localStorage.setItem('token', 'dev-token-123456');
          
          setSuccess('Login successful!');
          
          // Force navigation directly rather than waiting for context update
          setTimeout(() => {
            // Use direct window location change instead of navigate hook
            window.location.href = '/dashboard';
          }, 1000);
        }
        
        setIsLoading(false);
        
        /* Comment out actual API call for now
        await login(email, password);
        // Successful login will trigger the useEffect to handle redirect
        */
      } catch (err) {
        console.error('Login error:', err);
        setError(err.toString());
        setIsLoading(false);
      }
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
        
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Log in to your IdeaValidator account</p>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                className={formErrors.password ? 'error' : ''}
              />
            </div>
            {formErrors.password && <div className="error-message">{formErrors.password}</div>}
          </div>
          
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          
          <button type="submit" className="btn-auth" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="auth-alternate">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
      
      <div className="auth-image">
        <img src="/assets/login-illustration.svg" alt="Login" />
      </div>
    </div>
  );
};

export default Login; 