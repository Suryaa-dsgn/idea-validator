/**
 * auth-integration.js
 * Connects the static homepage UI with authentication and dashboard functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth integration script loaded');
    
    // Configuration - update to use direct redirects
    const apiUrl = '/api';          // Path to the backend API

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;
    
    console.log('Authentication status:', isAuthenticated ? 'Logged in' : 'Not logged in');

    // Get UI Elements
    const loginBtn = document.querySelector('.auth-buttons .btn-secondary');
    const signUpBtn = document.querySelector('.auth-buttons .btn-primary');
    const validateIdeaBtn = document.querySelector('.validate-btn');
    const ideaInput = document.querySelector('.idea-input');
    const contactForm = document.querySelector('.contact-form form');
    
    // Mobile UI elements
    const mobileLoginBtn = document.querySelector('.mobile-auth-buttons .btn-secondary');
    const mobileSignUpBtn = document.querySelector('.mobile-auth-buttons .btn-primary');
    
    // Log found elements for debugging
    console.log('Found login button:', !!loginBtn);
    console.log('Found signup button:', !!signUpBtn);
    console.log('Found validate button:', !!validateIdeaBtn);
    
    // Update UI to show login status if authenticated
    if (isAuthenticated) {
        updateUIForLoggedInUser();
    }

    // Add event listeners to the buttons
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            console.log('Login button clicked');
            e.preventDefault();
            window.location.href = '/login';
        });
    }
    
    if (signUpBtn) {
        signUpBtn.addEventListener('click', function(e) {
            console.log('Signup button clicked');
            e.preventDefault();
            window.location.href = '/signup';
        });
    }
    
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', function(e) {
            console.log('Mobile login button clicked');
            e.preventDefault();
            window.location.href = '/login';
        });
    }
    
    if (mobileSignUpBtn) {
        mobileSignUpBtn.addEventListener('click', function(e) {
            console.log('Mobile signup button clicked');
            e.preventDefault();
            window.location.href = '/signup';
        });
    }
    
    // Handle idea validation button
    if (validateIdeaBtn) {
        validateIdeaBtn.addEventListener('click', function(e) {
            console.log('Validate idea button clicked');
            e.preventDefault();
            const ideaText = ideaInput ? ideaInput.value.trim() : '';
            
            // Save the idea to localStorage temporarily
            if (ideaText) {
                localStorage.setItem('pendingIdea', ideaText);
                console.log('Saved idea to localStorage:', ideaText);
            }
            
            if (isAuthenticated) {
                // Already logged in, go straight to dashboard with the idea
                window.location.href = '/dashboard?validateIdea=true';
            } else {
                // Not logged in, direct to signup with a return_to parameter
                window.location.href = '/signup?return_to=dashboard&action=validate';
            }
        });
    }
    
    // Handle contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            console.log('Contact form submitted');
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Save the form data to localStorage temporarily
            localStorage.setItem('contactFormData', JSON.stringify(formDataObj));
            console.log('Saved form data to localStorage');
            
            // Send API request to submit contact form
            if (isAuthenticated) {
                submitContactForm(formDataObj);
            } else {
                // Not logged in, direct to signup with a return_to parameter
                window.location.href = '/login?return_to=contact';
            }
        });
    }
    
    // Update UI for logged in user
    function updateUIForLoggedInUser() {
        console.log('Updating UI for logged in user');
        
        // Change login button to "Dashboard"
        if (loginBtn) {
            loginBtn.textContent = 'Dashboard';
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = '/dashboard';
            });
        }
        
        // Change signup button to "Logout"
        if (signUpBtn) {
            signUpBtn.textContent = 'Logout';
            signUpBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Clear token
                localStorage.removeItem('token');
                window.location.reload();
            });
        }
        
        // Do the same for mobile buttons
        if (mobileLoginBtn) {
            mobileLoginBtn.textContent = 'Dashboard';
            mobileLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = '/dashboard';
            });
        }
        
        if (mobileSignUpBtn) {
            mobileSignUpBtn.textContent = 'Logout';
            mobileSignUpBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Clear token
                localStorage.removeItem('token');
                window.location.reload();
            });
        }
    }
    
    // Submit contact form to the API
    async function submitContactForm(formData) {
        try {
            console.log('Submitting contact form to API');
            const response = await fetch(`${apiUrl}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                // Clear form data
                localStorage.removeItem('contactFormData');
                alert('Thank you for your message. We will get back to you soon!');
                contactForm.reset();
            } else {
                throw new Error('Failed to submit the form');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('There was an error submitting your form. Please try again later.');
        }
    }
}); 