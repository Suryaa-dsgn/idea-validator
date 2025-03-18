import { register } from '../../api/auth';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBuilding } from 'react-icons/fa';
import './AuthForms.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    company: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { name, email, password, password2, company } = formData;
  
  const navigate = useNavigate();

  // Redirect if logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear field-specific error when user types
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!name) {
      errors.name = 'Name is required';
    }
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== password2) {
      errors.password2 = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    console.log('Form submitted');
    
    if (validateForm()) {
      setIsSubmitting(true);
      setAuthError(null);
      
      try {
        console.log('Attempting registration with:', formData);
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          company: formData.company || ''
        };
        
        // Show message that we're connecting
        setAuthError("Connecting to server. This may take a moment if the server is waking up...");
        
        const result = await register(userData);
        console.log('Registration successful', result);
        
        if (result && result.success) {
          setIsAuthenticated(true);
          navigate('/dashboard');
        } else {
          // Handle case where we get a response but it's not a success
          setAuthError(result?.message || "Registration failed. Please try again.");
          setIsSubmitting(false);
        }
      } catch (err) {
        console.error('Registration error:', err);
        setAuthError(typeof err === 'string' ? err : 'Unable to register. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Your Account</h2>
          <p>Start validating your startup ideas today</p>
        </div>
        
        {authError && <div className="auth-error">{authError}</div>}
        
        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                value={name}
                onChange={onChange}
                className={formErrors.name ? 'error' : ''}
              />
            </div>
            {formErrors.name && <div className="error-message">{formErrors.name}</div>}
          </div>
          
          <div className="form-group">
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={onChange}
                className={formErrors.email ? 'error' : ''}
              />
            </div>
            {formErrors.email && <div className="error-message">{formErrors.email}</div>}
          </div>
          
          <div className="form-group">
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                className={formErrors.password ? 'error' : ''}
              />
            </div>
            {formErrors.password && <div className="error-message">{formErrors.password}</div>}
          </div>
          
          <div className="form-group">
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Confirm Password"
                name="password2"
                value={password2}
                onChange={onChange}
                className={formErrors.password2 ? 'error' : ''}
              />
            </div>
            {formErrors.password2 && <div className="error-message">{formErrors.password2}</div>}
          </div>
          
          <div className="form-group">
            <div className="input-with-icon">
              <FaBuilding className="input-icon" />
              <input
                type="text"
                placeholder="Company (Optional)"
                name="company"
                value={company}
                onChange={onChange}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 