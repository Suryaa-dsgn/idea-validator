// Script to fix navigation links on the landing page
document.addEventListener('DOMContentLoaded', function() {
  // Function to handle navigation links
  function fixNavigationLinks() {
    // Find all links and buttons in the document
    const allElements = document.querySelectorAll('a, button');
    
    allElements.forEach(element => {
      // Get the text content
      const text = element.textContent.trim();
      
      // Fix Sign Up links
      if (text === 'Sign Up' || text === 'Validate My Idea →' || text.includes('Get Started')) {
        // Store the original href if it's a link
        const originalHref = element.getAttribute('href');
        
        element.addEventListener('click', function(event) {
          event.preventDefault();
          console.log('Navigating to signup page');
          window.location.href = '/signup';
        });
      }
      
      // Fix Log In links
      if (text === 'Log In') {
        // Store the original href if it's a link
        const originalHref = element.getAttribute('href');
        
        element.addEventListener('click', function(event) {
          event.preventDefault();
          console.log('Navigating to login page');
          window.location.href = '/login';
        });
      }
    });
    
    console.log('Navigation links fixed');
  }
  
  // Try to fix links immediately
  fixNavigationLinks();
  
  // Also try again after a delay in case the page content loads dynamically
  setTimeout(fixNavigationLinks, 1000);
}); 