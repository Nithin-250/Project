// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    menuBtn.classList.toggle('active');
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Animate statistics counter
function animateCounter(elementId, targetValue, duration = 2000, prefix = '', suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const increment = targetValue / (duration / 16);
    let currentValue = startValue;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        
        element.textContent = prefix + Math.floor(currentValue).toLocaleString('en-IN') + suffix;
    }, 16);
}

// Plan selection
function selectPlan(planName) {
    const planNames = {
        'basic': 'Basic Plan (₹999/month)',
        'professional': 'Professional Plan (₹2,499/month)',
        'enterprise': 'Enterprise Plan (₹4,999/month)'
    };
    
    alert(`You selected: ${planNames[planName] || planName}\n\nPlease fill out the contact form below to get started!`);
    
    // Scroll to contact section
    scrollToSection('contact');
    
    // Pre-select the plan in the form
    const planSelect = document.querySelector('select');
    if (planSelect) {
        planSelect.value = planName;
    }
}

// Form submission
function submitForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your interest! Our team will contact you within 24 hours.');
        event.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Simple chart drawing using canvas
function drawTransactionChart() {
    const canvas = document.getElementById('transactionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Generate sample data
    const dataPoints = 20;
    const data = [];
    for (let i = 0; i < dataPoints; i++) {
        data.push(Math.random() * 100 + 50);
    }
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 132, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
        const x = (width / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Draw the transaction line
    ctx.strokeStyle = '#00c6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
        const x = (width / (data.length - 1)) * i;
        const y = height - (data[i] / 150) * height;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = '#0084ff';
    for (let i = 0; i < data.length; i++) {
        const x = (width / (data.length - 1)) * i;
        const y = height - (data[i] / 150) * height;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            element.classList.add('visible');
        }
    });
}


// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in class to elements
    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .stat-card');
    animatedElements.forEach(el => el.classList.add('fade-in'));
    
    // Start animations
    setTimeout(() => {
        animateCounter('transactionsProcessed', 847);
        animateCounter('fraudDetected', 23);
        animateCounter('amountSaved', 125000, 2000, '', '');
    }, 500);
    
    // Draw chart
    drawTransactionChart();
    
    // Update chart periodically
    setInterval(() => {
        drawTransactionChart();
    }, 5000);
    
    // Add scroll event listeners
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
        animateOnScroll();
    });
    
    // Add click event listeners to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Initial animation check
    animateOnScroll();
});

// Add some interactive features
document.addEventListener('mousemove', function(e) {
    const cursor = { x: e.clientX, y: e.clientY };
    
    // Add subtle parallax effect to hero visual
    const heroVisual = document.querySelector('.ai-visual');
    if (heroVisual) {
        const rect = heroVisual.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (cursor.x - centerX) * 0.02;
        const deltaY = (cursor.y - centerY) * 0.02;
        
        heroVisual.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        const nav = document.querySelector('.nav');
        if (nav.style.display === 'flex') {
            toggleMobileMenu();
        }
    }
});

// Performance optimization: throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLink();
    animateOnScroll();
}, 100));

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Show a welcome message after everything loads
    setTimeout(() => {
        console.log('🇮🇳 Welcome to AI ANALYST - Built for India! 🚀');
    }, 1000);
});


