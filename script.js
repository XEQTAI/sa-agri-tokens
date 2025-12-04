// SA Agri Tokens - iOS-Optimized JavaScript

// iOS-style smooth scroll
document.documentElement.style.scrollBehavior = 'smooth';

// Mobile menu toggle with iOS animation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        navMenu.classList.toggle('active');

        // iOS-style haptic feedback simulation (visual)
        hamburger.style.transform = 'scale(0.9)';
        setTimeout(() => {
            hamburger.style.transform = 'scale(1)';
        }, 100);

        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            document.body.style.overflow = '';
        }
    });
}

// Close menu when clicking nav links
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
        const spans = hamburger?.querySelectorAll('span');
        if (spans) {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// iOS-style smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#whitepaper') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// iOS-style navbar on scroll with frosted glass effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
}, { passive: true });

// iOS-style intersection observer for fade-in animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for iOS-style animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .token-card, .step, .stat');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        fadeInObserver.observe(el);
    });
});

// iOS-style touch feedback for buttons
const buttons = document.querySelectorAll('.btn, .feature-card, .token-card, .stat');
buttons.forEach(button => {
    // Touch start - scale down
    button.addEventListener('touchstart', () => {
        button.style.transition = 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)';
    }, { passive: true });

    // Touch end - scale back
    button.addEventListener('touchend', () => {
        button.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
    }, { passive: true });
});

// Dynamic token price updates with smooth iOS animations
function updateTokenPrices() {
    const priceElement = document.querySelector('.token-price');
    const changeElement = document.querySelector('.token-change');

    if (priceElement && changeElement) {
        // Fade out
        priceElement.style.opacity = '0.5';
        changeElement.style.opacity = '0.5';

        setTimeout(() => {
            // Simulate price changes
            const currentPrice = 2850;
            const variation = (Math.random() - 0.5) * 100;
            const newPrice = currentPrice + variation;
            const changePercent = ((variation / currentPrice) * 100).toFixed(2);

            priceElement.textContent = `R ${newPrice.toFixed(2)}`;
            changeElement.textContent = `${changePercent > 0 ? '+' : ''}${changePercent}%`;
            changeElement.className = `token-change ${changePercent > 0 ? 'positive' : 'negative'}`;

            // Fade in with iOS spring animation
            priceElement.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            changeElement.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            priceElement.style.opacity = '1';
            changeElement.style.opacity = '1';
        }, 200);
    }
}

// Update prices every 5 seconds with smooth animations
if (document.querySelector('.token-price')) {
    setInterval(updateTokenPrices, 5000);
}

// iOS-style pull-to-refresh hint (visual only)
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    touchEndY = e.touches[0].clientY;
}, { passive: true });

// Prevent elastic scrolling on iOS for better UX
document.addEventListener('touchmove', (e) => {
    if (navMenu?.classList.contains('active')) {
        e.preventDefault();
    }
}, { passive: false });

// iOS-style viewport height fix for mobile browsers
const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

setViewportHeight();
window.addEventListener('resize', setViewportHeight);

// Add active state for iOS cards
document.querySelectorAll('.feature-card, .token-card, .step').forEach(card => {
    card.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    }, { passive: true });

    card.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    }, { passive: true });

    card.addEventListener('touchcancel', function() {
        this.style.transform = 'scale(1)';
    }, { passive: true });
});

// Optimize for iOS devices
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isIOS) {
    document.body.classList.add('ios-device');

    // Add iOS-specific meta tag dynamically
    const meta = document.createElement('meta');
    meta.name = 'apple-mobile-web-app-capable';
    meta.content = 'yes';
    document.head.appendChild(meta);

    const statusBarMeta = document.createElement('meta');
    statusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
    statusBarMeta.content = 'black-translucent';
    document.head.appendChild(statusBarMeta);
}

console.log('🌾 SA Agri Tokens - iOS-optimized experience loaded!');
console.log('📱 Touch targets: 44pt minimum');
console.log('✨ Smooth animations enabled');
console.log('🎨 Frosted glass effects active');