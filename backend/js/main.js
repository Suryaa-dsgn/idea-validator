/**
 * IdeaValidator - Main Script
 * Handles core application functionality and form submissions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Handle form submissions
    const contactForm = document.querySelector('.contact-form form');
    const newsletterForm = document.querySelector('.newsletter-form');
    const ideaForm = document.querySelector('.idea-input-container');
    
    // Contact form handler
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = contactForm.querySelector('#name').value;
            const email = contactForm.querySelector('#email').value;
            const message = contactForm.querySelector('#message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                showNotification('Thanks for reaching out! We\'ll get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
    
    // Newsletter form handler
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (!email) {
                showNotification('Please enter your email address', 'error');
                return;
            }
            
            const submitBtn = newsletterForm.querySelector('button');
            const originalText = submitBtn.textContent;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i>';
                showNotification('You\'ve been subscribed to our newsletter!', 'success');
                
                // Reset form
                newsletterForm.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
    
    // Idea validation form handler
    if (ideaForm) {
        ideaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const idea = ideaForm.querySelector('.idea-input').value;
            
            if (!idea) {
                showNotification('Please enter your startup idea', 'error');
                return;
            }
            
            const validateBtn = ideaForm.querySelector('.validate-btn');
            const originalHTML = validateBtn.innerHTML;
            
            validateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
            validateBtn.disabled = true;
            
            // Simulate idea validation process with a delay
            setTimeout(() => {
                // Scroll to demo section
                const demoSection = document.querySelector('.demo-container');
                if (demoSection) {
                    demoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Add a highlight effect to the demo
                    demoSection.classList.add('highlight-demo');
                    setTimeout(() => {
                        demoSection.classList.remove('highlight-demo');
                    }, 1500);
                }
                
                showNotification('Your idea has been analyzed! Check out the results below.', 'success');
                
                // Reset button
                validateBtn.innerHTML = originalHTML;
                validateBtn.disabled = false;
            }, 3000);
        });
    }
    
    // Handle button click for "Get Started for Free" CTA
    const ctaButton = document.querySelector('.btn-cta');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Scroll to top where the signup form would be
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Highlight the sign-up button after a short delay
            setTimeout(() => {
                const signUpBtn = document.querySelector('.auth-buttons .btn-primary');
                if (signUpBtn) {
                    signUpBtn.classList.add('highlight-btn');
                    setTimeout(() => {
                        signUpBtn.classList.remove('highlight-btn');
                    }, 1000);
                }
            }, 800);
        });
    }
    
    // Ensure form fields get focus effect
    const formFields = document.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', () => {
            field.parentElement.classList.add('field-focus');
        });
        
        field.addEventListener('blur', () => {
            field.parentElement.classList.remove('field-focus');
        });
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only apply to hash links that point to an element on the page
            if (link.hash && document.querySelector(link.hash)) {
                e.preventDefault();
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.nav-links.active');
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    
                    const menuBtn = document.querySelector('.mobile-menu-btn i');
                    if (menuBtn && menuBtn.classList.contains('fa-times')) {
                        menuBtn.classList.remove('fa-times');
                        menuBtn.classList.add('fa-bars');
                    }
                }
                
                // Scroll to the target section
                const targetSection = document.querySelector(link.hash);
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                
                window.scrollTo({
                    top: targetSection.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add 'Enter' key support for idea input
    const ideaInput = document.querySelector('.idea-input');
    if (ideaInput) {
        ideaInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const validateBtn = document.querySelector('.validate-btn');
                if (validateBtn) {
                    validateBtn.click();
                }
            }
        });
    }
});

// Helper function to show notifications
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add CSS for notifications
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
            }
            
            .notification {
                background-color: white;
                color: #333;
                padding: 15px 20px;
                margin-top: 10px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                max-width: 350px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-icon {
                margin-right: 12px;
                font-size: 18px;
            }
            
            .notification.success {
                border-left: 4px solid var(--secondary-color);
            }
            
            .notification.success .notification-icon {
                color: var(--secondary-color);
            }
            
            .notification.error {
                border-left: 4px solid #ef4444;
            }
            
            .notification.error .notification-icon {
                color: #ef4444;
            }
            
            .notification.info {
                border-left: 4px solid var(--primary-color);
            }
            
            .notification.info .notification-icon {
                color: var(--primary-color);
            }
            
            .notification-close {
                margin-left: auto;
                cursor: pointer;
                font-size: 14px;
                color: #64748b;
            }
            
            .highlight-demo {
                animation: highlightPulse 1.5s ease;
            }
            
            .highlight-btn {
                animation: highlightBtn 1s ease;
            }
            
            @keyframes highlightPulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
                }
                70% {
                    box-shadow: 0 0 0 15px rgba(99, 102, 241, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
                }
            }
            
            @keyframes highlightBtn {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
            }
            
            .field-focus {
                transition: transform 0.2s ease;
            }
            
            .field-focus input,
            .field-focus textarea {
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on notification type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-message">${message}</div>
        <div class="notification-close">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        
        // Remove from DOM after animation
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    });
    
    // Show notification with slight delay for animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (notification.parentNode === notificationContainer) {
            notification.classList.remove('show');
            
            setTimeout(() => {
                if (notification.parentNode === notificationContainer) {
                    notificationContainer.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
} 