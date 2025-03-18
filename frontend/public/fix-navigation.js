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