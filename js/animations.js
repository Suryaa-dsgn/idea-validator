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
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Toggle hamburger to X icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
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
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    
    if (testimonialSlider && testimonialCards.length) {
        let currentSlide = 0;
        const maxSlide = testimonialCards.length - 1;
        
        // Initialize the slider
        updateSlider();
        
        // Add click events to navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = currentSlide === 0 ? maxSlide : currentSlide - 1;
                updateSlider();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
                updateSlider();
            });
        }
        
        // Add click events to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
            });
        });
        
        function updateSlider() {
            // On mobile, stack cards vertically
            if (window.innerWidth < 768) {
                testimonialCards.forEach((card, index) => {
                    card.style.display = index === currentSlide ? 'block' : 'none';
                });
            } else {
                // On desktop, scroll horizontally
                testimonialSlider.style.transform = `translateX(-${currentSlide * 100 / testimonialCards.length}%)`;
            }
            
            // Update active dot
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        // Update slider when window is resized
        window.addEventListener('resize', updateSlider);
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