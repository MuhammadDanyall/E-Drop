// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Close mobile menu when a nav link is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// --- Auth helpers: allow public viewing but require login for protected actions ---
function getAuthToken() {
    return localStorage.getItem('authToken');
}
function isAuthenticated() {
    return !!getAuthToken();
}
function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/';
}

// Auto-bind click handlers for elements that require auth.
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-auth-type="signup"]').forEach(el => {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            openAuthModal('signup.html');
        });
    });

    document.querySelectorAll('[data-auth-type="login"]').forEach(el => {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            openAuthModal('login.html');
        });
    });

    const authModal = document.getElementById('auth-modal');
    const closeButton = authModal ? authModal.querySelector('.close-button') : null;
    const authFormContainer = document.getElementById('auth-form-container');

    function openAuthModal(formUrl) {
        if (!(authModal && authFormContainer)) return;

        authModal.classList.add('visible'); // Show the modal

        // Helper to wire internal modal links
        function attachModalLinks() {
            const showLoginLink = authFormContainer.querySelector('#show-login');
            const showSignupLink = authFormContainer.querySelector('#show-signup');

            if (showLoginLink) {
                showLoginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    openAuthModal('login.html');
                });
            }
            if (showSignupLink) {
                showSignupLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    openAuthModal('signup.html');
                });
            }
        }

        // Try inline template fallback first (templates embedded in index.html)
        try {
            const name = formUrl.replace(/.*\//, '').replace(/\.html$/, '');
            const tmpl = document.getElementById('tmpl-' + name);
            if (tmpl) {
                authFormContainer.innerHTML = tmpl.innerHTML;
                attachModalLinks();
                return;
            }
        } catch (e) {
            console.warn('Auth template check failed', e);
        }

        // Fallback: load via fetch
        fetch(formUrl)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const formContent = doc.querySelector('.auth-form-content');
                if (formContent) {
                    authFormContainer.innerHTML = formContent.outerHTML;
                    attachModalLinks();
                }
            })
            .catch(error => console.error('Error loading form:', error));
    }

    function closeAuthModal() {
        if (authModal) {
            authModal.classList.remove('visible');
            authFormContainer.innerHTML = ''; // Clear form content on close
        }
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeAuthModal);
    }

    if (authModal) {
        // Close when clicking outside the modal content
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }

    // Terms & Conditions Modal
    const termsModal = document.getElementById('terms-modal');
    const termsLink = document.getElementById('terms-link');
    const termsCloseButton = termsModal ? termsModal.querySelector('.close-button') : null;

    function openTermsModal() {
        if (termsModal) {
            termsModal.classList.add('visible');
        }
    }

    function closeTermsModal() {
        if (termsModal) {
            termsModal.classList.remove('visible');
        }
    }

    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            openTermsModal();
        });
    }

    if (termsCloseButton) {
        termsCloseButton.addEventListener('click', closeTermsModal);
    }

    if (termsModal) {
        // Close when clicking outside the modal content
        termsModal.addEventListener('click', (e) => {
            if (e.target === termsModal) {
                closeTermsModal();
            }
        });
    }

    // Existing "SIGN UP" and "LOGIN" buttons in the header
    const signupBtn = document.getElementById('signup-btn');
    const loginBtn = document.getElementById('login-btn');

    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal('signup.html');
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal('login.html');
        });
    }

    // E-Shipping tracking form
    const shippingForm = document.getElementById('shippingTrackForm');
    if (shippingForm) {
        shippingForm.addEventListener('submit', (e) => handleTrackingSubmit('shipping', e));
    }

    // E-Cargo tracking form
    const cargoForm = document.getElementById('cargoTrackForm');
    if (cargoForm) {
        cargoForm.addEventListener('submit', (e) => handleTrackingSubmit('cargo', e));
    }

    animateOnScroll();

    // Add loading animation to body
    document.body.classList.add('page-loaded');

    // Initialize navbar state
    handleNavbarScroll();

    // Initialize magnetic effects
    initializeMagneticEffects();

    // Initialize FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items (optional: remove if you want multiple open at once)
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                }
            });

            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // If the href is just '#' or empty, ignore it
        if (href === '#' || href === '') {
            e.preventDefault();
            return;
        }

        // If the link points to an ID on the current page, smooth scroll
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu after clicking a link
                if (navMenu) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        }
    });
});

// Auth Modal functionality
// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.background = 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.95) 100%)';
        } else {
            header.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
        }
    }
});

// Basic scroll animation for elements with animate-on-scroll class
window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.animate-on-scroll');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight * 0.9) {
            element.classList.add('animate-visible');
        }
    });
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body
    document.body.classList.add('page-loaded');

    // Initialize navbar state
    const header = document.querySelector('.header');
    if (header && window.scrollY <= 50) {
        header.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
    }
});
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    if (slides.length === 0) return;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Event listeners for carousel controls
const nextArrow = document.querySelector('.next-arrow');
const prevArrow = document.querySelector('.prev-arrow');

if (nextArrow) {
    nextArrow.addEventListener('click', nextSlide);
}

if (prevArrow) {
    prevArrow.addEventListener('click', prevSlide);
}

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Auto-play carousel (optional)
setInterval(nextSlide, 5000);

// Initialize first slide
showSlide(0);

// Advanced Scroll Animation System
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    elements.forEach((element, index) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;

        // Add animation when element comes into view
        if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
            // Add staggered delay based on element position
            const delay = (index % 6) * 0.1; // 0.1s delay between elements
            element.style.animationDelay = `${delay}s`;
            element.classList.add('animate-visible');
        }
    });
}

// Advanced Animation Triggers
function initializeAnimations() {
    // Page load animations
    setTimeout(() => {
        document.querySelectorAll('.animate-fade-in').forEach((el, index) => {
            el.style.animationDelay = `${index * 0.2}s`;
        });

        document.querySelectorAll('.animate-slide-up').forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
        });

        document.querySelectorAll('.animate-scale-in').forEach((el, index) => {
            el.style.animationDelay = `${index * 0.15}s`;
        });
    }, 100);

    // Counter animations
    animateCounters();

    // Scroll indicator
    createScrollIndicator();

    // Magnetic effects
    initializeMagneticEffects();
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(counter);
    });
}
function createScrollIndicator() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollIndicator.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    document.body.appendChild(scrollIndicator);

    // Hide/show based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollIndicator.style.display = 'flex';
        } else {
            scrollIndicator.style.display = 'none';
        }
    });
}

// Enhanced button animations
function enhanceButtons() {
    const buttons = document.querySelectorAll('button, .btn, .contact-btn, .cta-button, .cta-button-large');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';

            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Loading animations for forms
function addFormAnimations() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<span class="loading"></span> Processing...';
                submitBtn.disabled = true;

                // Simulate processing (remove this in real implementation)
                setTimeout(() => {
                    submitBtn.innerHTML = '✓ Success!';
                    submitBtn.style.background = '#28a745';

                    setTimeout(() => {
                        submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Submit';
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                    }, 2000);
                }, 2000);
            }
        });

        // Store original button text
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
        }
    });
}

// Parallax effects
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const rate = element.getAttribute('data-parallax-rate') || 0.5;
            element.style.transform = `translateY(${scrolled * rate}px)`;
        });
    });
}

// Text reveal animations
function initializeTextReveals() {
    const textElements = document.querySelectorAll('.text-reveal h1, .text-reveal h2, .text-reveal h3');

    textElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.width = 'fit-content';

        // Create wrapper for typewriter effect
        const wrapper = document.createElement('span');
        wrapper.className = 'typewriter';
        wrapper.textContent = text;
        element.appendChild(wrapper);
    });
}

// Intersection Observer for advanced animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Add different animation classes based on element type
                if (element.classList.contains('service-card')) {
                    element.style.animationDelay = `${(index % 8) * 0.1}s`;
                    element.classList.add('animate-scale-in');
                } else if (element.classList.contains('feature-card')) {
                    element.style.animationDelay = `${(index % 6) * 0.15}s`;
                    element.classList.add('animate-slide-up');
                } else if (element.classList.contains('why-choose-card')) {
                    element.style.animationDelay = `${(index % 4) * 0.2}s`;
                    element.classList.add('animate-fade-in');
                }

                // Add visible class for custom animations
                element.classList.add('animate-visible');
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.service-card, .feature-card, .why-choose-card, .overview-card').forEach(card => {
        observer.observe(card);
    });
}


// Initialize all animations on page load
document.addEventListener('DOMContentLoaded', () => {

    // Initialize advanced animations
    initializeAnimations();

    // Enhanced scroll animations
    animateOnScroll();

    // Button enhancements
    enhanceButtons();

    // Form animations
    addFormAnimations();

    // Parallax effects
    initializeParallax();

    // Text reveals
    initializeTextReveals();

    // Intersection observer
    initializeIntersectionObserver();
});
// Sticky Navbar Functionality
const navbar = document.querySelector('.header');

function handleNavbarScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add scrolled class when scrolled down for background effect
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Add scroll event listener for navbar
window.addEventListener('scroll', handleNavbarScroll);

// Add scroll event listener for animations
window.addEventListener('scroll', animateOnScroll);

// Magnetic Effects
function initializeMagneticEffects() {
    // Only apply magnetic effect on devices with a mouse
    if (window.matchMedia("(any-hover: none)").matches) return;

    const magneticElements = document.querySelectorAll('.magnetic');

    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

// Scroll Progress Indicator and Scroll to Top
function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;

    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }

    // Show/hide scroll to top button
    const scrollToTop = document.querySelector('.scroll-to-top');
    if (scrollToTop) {
        if (scrollTop > 300) {
            scrollToTop.classList.add('show');
        } else {
            scrollToTop.classList.remove('show');
        }
    }
}

window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('load', updateScrollProgress);

// Tracking System Functionality
const mockTrackingData = {
    // E-Shipping tracking data
    shipping: {
        'ESH001': {
            status: 'delivered',
            origin: 'Peshawar, Pakistan',
            destination: 'Islamabad, Pakistan',
            estimatedDelivery: '2024-12-15',
            packageType: 'Document',
            weight: '0.5 kg',
            serviceType: 'Express Delivery',
            timeline: {
                booked: { date: '2024-12-10', time: '09:00 AM', completed: true },
                picked: { date: '2024-12-11', time: '02:30 PM', completed: true },
                transit: { date: '2024-12-12', time: '08:15 AM', completed: true },
                delivered: { date: '2024-12-12', time: '04:45 PM', completed: true }
            }
        },
        'ESH002': {
            status: 'transit',
            origin: 'Karachi, Pakistan',
            destination: 'Lahore, Pakistan',
            estimatedDelivery: '2024-12-20',
            packageType: 'Package',
            weight: '2.3 kg',
            serviceType: 'Standard Delivery',
            timeline: {
                booked: { date: '2024-12-14', time: '11:20 AM', completed: true },
                picked: { date: '2024-12-15', time: '01:45 PM', completed: true },
                transit: { date: '2024-12-16', time: '06:30 AM', completed: true },
                delivered: { date: null, time: null, completed: false }
            }
        },
        'ESH003': {
            status: 'picked',
            origin: 'Quetta, Pakistan',
            destination: 'Peshawar, Pakistan',
            estimatedDelivery: '2024-12-18',
            packageType: 'Package',
            weight: '1.8 kg',
            serviceType: 'Express Delivery',
            timeline: {
                booked: { date: '2024-12-16', time: '10:15 AM', completed: true },
                picked: { date: '2024-12-16', time: '03:20 PM', completed: true },
                transit: { date: null, time: null, completed: false },
                delivered: { date: null, time: null, completed: false }
            }
        }
    },
    // E-Cargo tracking data
    cargo: {
        'ECA001': {
            status: 'transit',
            origin: 'Port Qasim, Pakistan',
            destination: 'Dubai, UAE',
            estimatedDelivery: '2024-12-25',
            cargoType: 'Electronics',
            weight: '500 kg',
            carrier: 'Ocean Freight',
            timeline: {
                booked: { date: '2024-12-01', time: '10:00 AM', completed: true },
                picked: { date: '2024-12-05', time: '08:30 AM', completed: true },
                transit: { date: '2024-12-10', time: '02:15 PM', completed: true },
                delivered: { date: null, time: null, completed: false }
            }
        },
        'ECA002': {
            status: 'delivered',
            origin: 'Lahore, Pakistan',
            destination: 'Karachi, Pakistan',
            estimatedDelivery: '2024-12-12',
            cargoType: 'Textiles',
            weight: '1200 kg',
            carrier: 'Road Transport',
            timeline: {
                booked: { date: '2024-12-08', time: '09:45 AM', completed: true },
                picked: { date: '2024-12-09', time: '11:20 AM', completed: true },
                transit: { date: '2024-12-10', time: '07:30 AM', completed: true },
                delivered: { date: '2024-12-11', time: '03:15 PM', completed: true }
            }
        },
        'ECA003': {
            status: 'picked',
            origin: 'Islamabad, Pakistan',
            destination: 'Beijing, China',
            estimatedDelivery: '2025-01-05',
            cargoType: 'Machinery',
            weight: '2500 kg',
            carrier: 'Air Freight',
            timeline: {
                booked: { date: '2024-12-15', time: '02:30 PM', completed: true },
                picked: { date: '2024-12-16', time: '10:45 AM', completed: true },
                transit: { date: null, time: null, completed: false },
                delivered: { date: null, time: null, completed: false }
            }
        }
    }
};

function formatDateTime(date, time) {
    if (!date || !time) return '--';
    return `${date} at ${time}`;
}

function updateTimeline(timelineElement, timelineData) {
    const items = timelineElement.querySelectorAll('.timeline-item, .timeline-item-modern');

    items.forEach((item, index) => {
        const statusKeys = ['booked', 'picked', 'transit', 'delivered'];
        const statusKey = statusKeys[index];
        const statusData = timelineData[statusKey];

        if (statusData && statusData.completed) {
            item.classList.add('completed');
            item.classList.add('active');
            const dateElement = item.querySelector(`#${timelineElement.id.replace('timeline', statusKey)}-date`) ||
                item.querySelector(`#cargo-${statusKey}-date`) ||
                item.querySelector(`#shipping-${statusKey}-date`);
            if (dateElement) {
                dateElement.textContent = `Date: ${formatDateTime(statusData.date, statusData.time)}`;
            }
        } else if (index === 0 || (index > 0 && timelineData[statusKeys[index - 1]]?.completed)) {
            item.classList.add('active');
        }
    });
}

function updateProgressBar(type, status) {
    const progressFill = document.getElementById(`${type}ProgressFill`);
    const steps = document.querySelectorAll(`#${type === 'cargo' ? 'step' : 'shipping-timeline'}-booked,
                                             #${type === 'cargo' ? 'step' : 'shipping-timeline'}-picked,
                                             #${type === 'cargo' ? 'step' : 'shipping-timeline'}-transit,
                                             #${type === 'cargo' ? 'step' : 'shipping-timeline'}-delivered`);

    let progressPercentage = 0;

    if (status === 'delivered') progressPercentage = 100;
    else if (status === 'transit') progressPercentage = 75;
    else if (status === 'picked') progressPercentage = 50;
    else if (status === 'booked') progressPercentage = 25;

    if (progressFill) {
        progressFill.style.width = `${progressPercentage}%`;
    }
}

function updateStatusBadge(type, status) {
    const badge = document.getElementById(`${type}StatusBadge`);
    const statusText = document.getElementById(`${type}StatusText`);

    if (badge && statusText) {
        // Remove existing status classes
        badge.className = 'status-badge';

        // Add appropriate status class and icon
        switch (status) {
            case 'booked':
                badge.classList.add('booked');
                badge.innerHTML = '<i class="fas fa-calendar-check"></i><span id="' + type + 'StatusText">Order Booked</span>';
                break;
            case 'picked':
                badge.classList.add('picked');
                badge.innerHTML = '<i class="fas fa-box"></i><span id="' + type + 'StatusText">Picked Up</span>';
                break;
            case 'transit':
                badge.classList.add('transit');
                badge.innerHTML = '<i class="fas fa-truck"></i><span id="' + type + 'StatusText">In Transit</span>';
                break;
            case 'delivered':
                badge.classList.add('delivered');
                badge.innerHTML = '<i class="fas fa-check-double"></i><span id="' + type + 'StatusText">Delivered</span>';
                break;
        }
    }
}

function showTrackingResults(type, trackingNumber, data) {
    const resultsContainer = document.getElementById(`${type}TrackingResults`);
    const errorContainer = document.getElementById(`${type}TrackingError`);
    const displayTrackingNumber = document.getElementById(`${type}DisplayTrackingNumber`);

    // Hide error, show results
    errorContainer.style.display = 'none';
    resultsContainer.style.display = 'block';

    // Update tracking number display
    if (displayTrackingNumber) {
        displayTrackingNumber.textContent = trackingNumber;
    }

    // Update status badge and progress bar (for modern design)
    updateStatusBadge(type, data.status);
    updateProgressBar(type, data.status);

    // Update shipment details
    const prefix = type === 'shipping' ? 'shipping' : 'cargo';
    const originElement = document.getElementById(`${prefix}-origin`);
    const destinationElement = document.getElementById(`${prefix}-destination`);
    const deliveryElement = document.getElementById(`${prefix}-estimated-delivery`);

    if (originElement) originElement.textContent = data.origin;
    if (destinationElement) destinationElement.textContent = data.destination;
    if (deliveryElement) deliveryElement.textContent = data.estimatedDelivery;

    if (type === 'shipping') {
        const packageTypeElement = document.getElementById('shipping-package-type');
        const weightElement = document.getElementById('shipping-weight');
        const serviceElement = document.getElementById('shipping-service-type');

        if (packageTypeElement) packageTypeElement.textContent = data.packageType;
        if (weightElement) weightElement.textContent = data.weight;
        if (serviceElement) serviceElement.textContent = data.serviceType;
    } else {
        const cargoTypeElement = document.getElementById('cargo-type');
        const weightElement = document.getElementById('cargo-weight');
        const carrierElement = document.getElementById('cargo-carrier');
        const transportModeElement = document.getElementById('cargo-transport-mode');
        const currentStatusElement = document.getElementById('cargo-current-status');

        if (cargoTypeElement) cargoTypeElement.textContent = data.cargoType;
        if (weightElement) weightElement.textContent = data.weight;
        if (carrierElement) carrierElement.textContent = data.carrier;
        if (transportModeElement) transportModeElement.textContent = data.carrier === 'Ocean Freight' ? 'Sea Freight' : 'Road Freight';
        if (currentStatusElement) currentStatusElement.textContent = data.status === 'delivered' ? 'Completed' : 'On Time';
    }

    // Update timeline
    const timelineElement = document.getElementById(`${prefix}-timeline`);
    if (timelineElement) {
        updateTimeline(timelineElement, data.timeline);
    }

    // Update last update time
    const lastUpdateElement = document.getElementById('lastUpdateTime');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = new Date().toLocaleString();
    }
}

function handleTrackingSubmit(type, event) {
    event.preventDefault();

    const inputId = type === 'shipping' ? 'shippingTrackingNumber' : 'cargoTrackingNumber';
    const trackingNumber = document.getElementById(inputId).value.trim().toUpperCase();

    if (!trackingNumber) {
        alert('Please enter a tracking number');
        return;
    }

    const data = mockTrackingData[type][trackingNumber];

    if (data) {
        showTrackingResults(type, trackingNumber, data);
    } else {
        // Show error
        const resultsContainer = document.getElementById(`${type}TrackingResults`);
        const errorContainer = document.getElementById(`${type}TrackingError`);

        resultsContainer.style.display = 'none';
        errorContainer.style.display = 'block';
    }
}



// Add hover effect for service cards with staggered animation
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Button click ripple effect
document.querySelectorAll('.contact-btn, .service-link, .btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        this.appendChild(ripple);

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

/* ========================================================================= */
/* ADVANCED ANIMATIONS & PREMIUM UX EFFECTS */
/* ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader Removal ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Force minimum display time for the cool animation, then fade it out smoothly.
        setTimeout(() => {
            preloader.classList.add('loaded');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }, 800);
    }

    // --- Inject Professional Animations (AOS) Site-Wide ---
    if (!document.getElementById('aos-css-inj')) {
        const aosCss = document.createElement('link');
        aosCss.id = 'aos-css-inj';
        aosCss.rel = 'stylesheet';
        aosCss.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
        document.head.appendChild(aosCss);

        const aosJs = document.createElement('script');
        aosJs.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
        document.body.appendChild(aosJs);

        aosJs.onload = () => {
            // Apply data-aos dynamically
            const animateEls = document.querySelectorAll('.service-card, .team-member, .why-choose-card, .term-section, .process-card, .feature-card, .testimonial-card, .step-card, section h2, section h3');
            animateEls.forEach((el, i) => {
                if (!el.hasAttribute('data-aos')) {
                    el.setAttribute('data-aos', 'fade-up');
                    el.setAttribute('data-aos-delay', (i % 3) * 100);
                }
            });

            // Initialize AOS
            if (window.AOS) {
                AOS.init({
                    duration: 800,
                    easing: 'ease-out-cubic',
                    once: true,
                    offset: 50
                });
            }
        };
    }

    // --- Dynamic Intersection Observer for Scroll Animations ---
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    if (animateElements.length > 0) {
        const appearOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const appearOnScroll = new IntersectionObserver(function (entries, observer) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, appearOptions);

        animateElements.forEach(el => {
            appearOnScroll.observe(el);
        });
    }
});

// Load vanilla-tilt.js dynamically if not present
if (!window.VanillaTilt) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js';
    script.onload = () => {
        VanillaTilt.init(document.querySelectorAll(".service-card, .team-member, .why-choose-card, .term-section, .policy-section, .solution-card, .problem-card"), {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.15,
            scale: 1.02
        });
    };
    document.body.appendChild(script);
}