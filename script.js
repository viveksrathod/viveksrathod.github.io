/* ============================================
   VIVEK RATHOD - PORTFOLIO WEBSITE
   Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initCursorGlow();
    initNavigation();
    initCounterAnimation();
    initScrollAnimations();
    initTimelineProgress();
    initSmoothScroll();
});

/* ============================================
   CURSOR GLOW EFFECT
   ============================================ */
function initCursorGlow() {
    const cursorGlow = document.querySelector('.cursor-glow');
    if (!cursorGlow) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    const ease = 0.08;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Smooth interpolation
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;

        cursorGlow.style.left = currentX + 'px';
        cursorGlow.style.top = currentY + 'px';

        requestAnimationFrame(animate);
    }

    animate();

    // Hide on mobile
    if ('ontouchstart' in window) {
        cursorGlow.style.display = 'none';
    }
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    let lastScrollY = window.scrollY;

    // Scroll behavior
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Add scrolled class
        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    });

    // Mobile toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const start = performance.now();

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(easedProgress * target);

            counter.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    // Add animation classes to elements
    const animatableSelectors = [
        '.section-header',
        '.about-visual',
        '.about-content',
        '.timeline-item',
        '.expertise-card',
        '.cert-category',
        '.interest-card',
        '.education-card',
        '.recognition',
        '.connect-content'
    ];

    const elements = document.querySelectorAll(animatableSelectors.join(', '));

    elements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        // Add stagger class for grid items
        if (el.classList.contains('expertise-card') ||
            el.classList.contains('interest-card') ||
            el.classList.contains('cert-category')) {
            el.classList.add(`stagger-${(index % 6) + 1}`);
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    elements.forEach(el => observer.observe(el));
}

/* ============================================
   TIMELINE PROGRESS
   ============================================ */
function initTimelineProgress() {
    const timeline = document.querySelector('.timeline');
    const timelineProgress = document.querySelector('.timeline-progress');

    if (!timeline || !timelineProgress) return;

    const updateProgress = () => {
        const rect = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate how much of the timeline is visible
        const timelineTop = rect.top;
        const timelineHeight = rect.height;
        const visibleStart = Math.max(0, windowHeight - timelineTop);
        const progress = Math.min(visibleStart / timelineHeight, 1);

        timelineProgress.style.height = `${progress * 100}%`;
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile nav if open
                const navLinks = document.querySelector('.nav-links');
                const navToggle = document.querySelector('.nav-toggle');
                if (navLinks && navToggle) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
}

/* ============================================
   SKILL CLOUD HOVER EFFECTS
   ============================================ */
document.querySelectorAll('.skill').forEach(skill => {
    skill.addEventListener('mouseenter', () => {
        // Add subtle parallax to nearby skills
        const siblings = [...skill.parentElement.children];
        siblings.forEach((sibling, index) => {
            if (sibling !== skill) {
                const distance = Math.abs(siblings.indexOf(skill) - index);
                const scale = 1 - (distance * 0.02);
                sibling.style.transform = `scale(${scale})`;
                sibling.style.opacity = 0.7;
            }
        });
    });

    skill.addEventListener('mouseleave', () => {
        const siblings = [...skill.parentElement.children];
        siblings.forEach(sibling => {
            sibling.style.transform = '';
            sibling.style.opacity = '';
        });
    });
});

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Hero parallax - subtle movement only, no opacity fade
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
    }

    // Visual frame parallax in about section
    const visualFrame = document.querySelector('.visual-frame');
    if (visualFrame) {
        const rect = visualFrame.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const offset = (rect.top - window.innerHeight / 2) * 0.03;
            visualFrame.style.transform = `translateY(${offset}px)`;
        }
    }
});

/* ============================================
   CARD TILT EFFECT
   ============================================ */
document.querySelectorAll('.expertise-card, .interest-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ============================================
   TYPING EFFECT FOR TAGLINE (Optional)
   ============================================ */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

/* ============================================
   PAGE LOAD ANIMATION
   ============================================ */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Stagger hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-role, .hero-tagline, .hero-stats, .hero-cta');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${0.2 + (index * 0.1)}s`;
    });
});

/* ============================================
   INTERSECTION OBSERVER FOR LAZY LOADING
   ============================================ */
const lazyElements = document.querySelectorAll('[data-lazy]');
const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
            lazyObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

lazyElements.forEach(el => lazyObserver.observe(el));

/* ============================================
   MAGNETIC BUTTON EFFECT
   ============================================ */
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

/* ============================================
   CONSOLE EASTER EGG
   ============================================ */
console.log(`
%c╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   👋 Hey there, fellow developer!                         ║
║                                                           ║
║   Thanks for checking out my portfolio.                   ║
║   Interested in working together?                         ║
║                                                           ║
║   Connect with me on LinkedIn:                            ║
║   https://linkedin.com/in/vivekrathod                     ║
║                                                           ║
║   — Vivek Rathod                                          ║
║     Director of Technical Architecture                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`, 'color: #818cf8; font-family: monospace;');
