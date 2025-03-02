/**
 * IdeaValidator - Animations
 * Handles all micro-animations and interactive elements
 */

document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.padding = 'var(--spacing-md) 0';
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    
    if (mobileMenuBtn) {
        // Function to open mobile menu with staggered animations
        function openMobileMenu() {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            
            // Animate menu items with staggered delay
            mobileNavLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.classList.add('appear');
                }, 100 + (index * 100));
            });
            
            // Animate auth buttons
            const authButtons = mobileMenu.querySelectorAll('.mobile-auth-buttons .btn');
            authButtons.forEach((btn, index) => {
                setTimeout(() => {
                    btn.classList.add('appear');
                }, 500 + (index * 100));
            });
        }

        // Function to close mobile menu
        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            
            // Reset animations
            mobileNavLinks.forEach(link => {
                link.classList.remove('appear');
            });
            
            const authButtons = mobileMenu.querySelectorAll('.mobile-auth-buttons .btn');
            authButtons.forEach(btn => {
                btn.classList.remove('appear');
            });
        }

        // Event listeners
        mobileMenuBtn.addEventListener('click', openMobileMenu);
        mobileMenuClose.addEventListener('click', closeMobileMenu);
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);

        // Close menu when clicking on a nav link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // Add reveal animations when scrolling
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.feature, .step, .testimonial-card, .info-item');
    revealElements.forEach(el => {
        el.classList.add('reveal-element');
        observer.observe(el);
    });

    // Testimonial slider functionality
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (testimonialSlider && testimonialCards.length) {
        let currentSlide = 0;
        let maxVisibleSlides = 3; // Default for desktop
        const totalSlides = testimonialCards.length;
        let isTransitioning = false;
        let autoplayTimer;
        let dots = [];
        
        // Function to generate the dots
        function generateDots() {
            // Clear existing dots
            dotsContainer.innerHTML = '';
            dots = [];
            
            // Add new dots based on the number of slides
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === currentSlide) {
                    dot.classList.add('active');
                }
                
                dot.addEventListener('click', () => {
                    if (!isTransitioning && currentSlide !== i) {
                        stopAutoplay();
                        currentSlide = i;
                        updateSlider();
                        startAutoplay();
                    }
                });
                
                dotsContainer.appendChild(dot);
                dots.push(dot);
            }
        }
        
        // Function to determine how many slides to show based on screen width
        function updateVisibleSlides() {
            if (window.innerWidth < 768) {
                maxVisibleSlides = 1;
            } else if (window.innerWidth < 1024) {
                maxVisibleSlides = 2;
            } else {
                maxVisibleSlides = 3;
            }
            updateSlider();
        }
        
        // Initialize the slider
        generateDots();
        updateVisibleSlides();
        
        // Start autoplay
        startAutoplay();
        
        // Add click events to navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (!isTransitioning) {
                    stopAutoplay();
                    navigateSlider('prev');
                    startAutoplay();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (!isTransitioning) {
                    stopAutoplay();
                    navigateSlider('next');
                    startAutoplay();
                }
            });
        }
        
        // Pause autoplay on hover
        testimonialSlider.addEventListener('mouseenter', stopAutoplay);
        testimonialSlider.addEventListener('mouseleave', startAutoplay);
        
        function navigateSlider(direction) {
            if (direction === 'next') {
                currentSlide = (currentSlide + 1) % totalSlides;
            } else {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            }
            updateSlider();
        }
        
        function updateSlider() {
            isTransitioning = true;
            
            // Calculate the percentage to move based on visible slides
            const slidePercentage = 100 / Math.min(totalSlides, maxVisibleSlides);
            const translateValue = currentSlide * slidePercentage;
            
            testimonialSlider.style.transform = `translateX(-${translateValue}%)`;
            
            // Update active dot
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            // Reset transitioning flag after animation completes
            setTimeout(() => {
                isTransitioning = false;
            }, 500); // Match this with CSS transition time
        }
        
        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(() => {
                navigateSlider('next');
            }, 5000);
        }
        
        function stopAutoplay() {
            clearInterval(autoplayTimer);
        }
        
        // Update slider when window is resized
        window.addEventListener('resize', updateVisibleSlides);
    }

    // Add hover animations to buttons and interactive elements
    const btns = document.querySelectorAll('.btn');
    const hoverElements = document.querySelectorAll('.feature, .step-content, .testimonial-card, .social-link');
    
    btns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px)';
            btn.style.boxShadow = 'var(--shadow-lg)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.boxShadow = '';
        });
    });
    
    // Add subtle pulse animation to CTA button
    const ctaButton = document.querySelector('.btn-cta');
    if (ctaButton) {
        setInterval(() => {
            ctaButton.classList.add('pulse');
            setTimeout(() => {
                ctaButton.classList.remove('pulse');
            }, 1000);
        }, 5000);
    }

    // Progress bar animation in demo section
    const progressBars = document.querySelectorAll('.progress');
    
    if (progressBars.length) {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target;
                    progress.style.width = progress.parentElement.dataset.value || progress.style.width;
                    progressObserver.unobserve(progress);
                }
            });
        }, observerOptions);
        
        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }

    // Idea input field animation
    const ideaInput = document.querySelector('.idea-input');
    const validateBtn = document.querySelector('.validate-btn');
    
    if (ideaInput && validateBtn) {
        ideaInput.addEventListener('focus', () => {
            validateBtn.classList.add('ready');
        });
        
        ideaInput.addEventListener('blur', () => {
            if (!ideaInput.value.trim()) {
                validateBtn.classList.remove('ready');
            }
        });
        
        // Subtle bounce animation for arrow in button
        validateBtn.addEventListener('mouseenter', () => {
            const arrow = validateBtn.querySelector('i');
            if (arrow) {
                arrow.style.transform = 'translateX(4px)';
                setTimeout(() => {
                    arrow.style.transform = '';
                }, 200);
            }
        });
    }

    // Add CSS variables for animations
    document.documentElement.style.setProperty('--reveal-transition', '0.6s ease-out');
});

// Add CSS for animation-specific elements
const style = document.createElement('style');
style.textContent = `
    .reveal-element {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity var(--reveal-transition), transform var(--reveal-transition);
    }
    
    .reveal-element.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    @media (prefers-reduced-motion: reduce) {
        .reveal-element {
            transition: none;
            opacity: 1;
            transform: none;
        }
    }
    
    .pulse {
        animation: btnPulse 1s ease-out;
    }
    
    @keyframes btnPulse {
        0% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(249, 115, 22, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
        }
    }
    
    .validate-btn .fa-arrow-right {
        transition: transform 0.2s ease;
    }
    
    .validate-btn.ready {
        background: linear-gradient(135deg, var(--secondary-color), #06b6d4);
    }
    
    .testimonial-slider {
        transition: transform 0.5s ease-in-out;
    }
    
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            width: 100%;
            background-color: var(--white);
            padding: 1rem 0;
            box-shadow: var(--shadow-md);
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            transform: translateY(-100%);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 100;
        }
        
        .nav-links.active {
            transform: translateY(0);
            opacity: 1;
        }
        
        body.menu-open {
            overflow: hidden;
        }
    }
`;

document.head.appendChild(style); 