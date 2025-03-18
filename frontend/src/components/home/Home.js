import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    // Get the static fallback content from index.html
    const staticContent = document.getElementById('static-fallback');
    
    // If there's a static fallback, show it
    if (staticContent) {
      staticContent.style.display = 'block';
    }
    
    // Load any scripts needed for the static home page
    const script = document.createElement('script');
    script.src = '/fix-navigation.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Clean up when component unmounts
      if (staticContent) {
        staticContent.style.display = 'none';
      }
      document.body.removeChild(script);
    };
  }, []);

  // Return an empty div - the static content will be shown instead
  return <div style={{ display: 'none' }}></div>;
};

export default Home; 