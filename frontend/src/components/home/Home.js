import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import logo from '../../assets/logo.svg'; // You'll need to create this logo file

const Home = () => {
  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="IdeaValidator" />
            <span>IdeaValidator</span>
          </Link>
          
          <div className="navbar-links">
            <Link to="/#about" className="nav-link">About</Link>
            <Link to="/#how-it-works" className="nav-link">How It Works</Link>
            <Link to="/#success-stories" className="nav-link">Success Stories</Link>
            <Link to="/#contact" className="nav-link">Contact</Link>
          </div>
          
          <div className="navbar-cta">
            <Link to="/login" className="btn btn-secondary">Log In</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Transform Your Startup Ideas into Reality with AI</h1>
            <p className="hero-description">
              Get instant, data-driven validation for your startup concepts.
              No more guesswork, just actionable insights to help you build with confidence.
            </p>
            
            <div className="hero-input-container">
              <input 
                type="text" 
                className="hero-input" 
                placeholder="Enter your startup idea..." 
              />
              <Link to="/signup" className="btn hero-btn">
                Validate My Idea →
              </Link>
            </div>
            
            <div className="hero-stats">
              <div className="stat">
                <h3>5,000+</h3>
                <p>Ideas Validated</p>
              </div>
              <div className="stat">
                <h3>87%</h3>
                <p>Accuracy Rate</p>
              </div>
              <div className="stat">
                <h3>2,300+</h3>
                <p>Happy Founders</p>
              </div>
            </div>
          </div>
          
          <div className="hero-image">
            {/* This will be your validation dashboard illustration */}
            <img src="https://placehold.co/600x400" alt="Idea Validation Report" className="dashboard-image" />
          </div>
        </div>
      </section>
      
      {/* You can add more sections here for About, How It Works, etc. */}
      
      {/* Footer would go here */}
    </div>
  );
};

export default Home; 