// Script to fix navigation links on the landing page without changing design
document.addEventListener('DOMContentLoaded', function() {
  // Function to handle navigation links
  function fixNavigationLinks() {
    // Find all links and buttons in the document
    const allElements = document.querySelectorAll('a, button');
    
    allElements.forEach(element => {
      // Check if element has children that contain text
      let textContent = element.textContent.trim();
      
      // Check for Sign Up buttons
      if (textContent === 'Sign Up' || 
          textContent.includes('Sign Up') || 
          textContent.includes('Validate My Idea') || 
          textContent.includes('Get Started')) {
        
        // Add click handler
        element.addEventListener('click', function(event) {
          event.preventDefault();
          window.location.href = '/signup';
        });
      }
      
      // Check for Log In buttons
      if (textContent === 'Log In' || 
          textContent.includes('Log In')) {
        
        // Add click handler
        element.addEventListener('click', function(event) {
          event.preventDefault();
          window.location.href = '/login';
        });
      }
    });
    
    console.log('Navigation links fixed without changing design');
  }
  
  // Run immediately and also after a slight delay to ensure all elements are loaded
  fixNavigationLinks();
  setTimeout(fixNavigationLinks, 1000);
  
  // Also run when React's content changes
  const observer = new MutationObserver(function(mutations) {
    fixNavigationLinks();
  });

  // Start observing the document body for DOM changes
  observer.observe(document.body, { childList: true, subtree: true });
});

// fix-navigation.js - Ensures proper navigation for the static home page

console.log('Navigation fix script loaded');

// Function to handle navigation clicks for signup and login
document.addEventListener('click', function(event) {
  // Get the clicked element and any parent anchor tags
  let target = event.target;
  let anchorElement = target.closest('a');
  
  if (!anchorElement) return;
  
  // Handle Sign Up buttons
  if (anchorElement.textContent.trim() === 'Sign Up' || 
      anchorElement.textContent.includes('Validate My Idea') ||
      anchorElement.textContent.includes('Get Started')) {
    event.preventDefault();
    window.location.href = '/signup';
  }
  
  // Handle Log In buttons
  if (anchorElement.textContent.trim() === 'Log In') {
    event.preventDefault();
    window.location.href = '/login';
  }
  
  // Handle navigation to React components for anchor links
  if (anchorElement.getAttribute('href') && anchorElement.getAttribute('href').startsWith('#')) {
    const sectionId = anchorElement.getAttribute('href').substring(1);
    const section = document.getElementById(sectionId);
    
    if (section) {
      event.preventDefault();
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// Make sure the static fallback is visible
const staticContent = document.getElementById('static-fallback');
if (staticContent) {
  staticContent.style.display = 'block';
} 