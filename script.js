document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Navbar Scroll Effect
    // ==========================================================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // Mobile Menu Toggle
    // ==========================================================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // ==========================================================================
    // Scroll Reveal Animations
    // ==========================================================================
    const revealElements = document.querySelectorAll('.fade-in, .reveal-up, .reveal-left, .reveal-right');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Trigger animations for elements already in viewport on load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .fade-in');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('active');
            }, index * 200); // Stagger effect
        });
    }, 100);

    // ==========================================================================
    // News Slider (Drag & Buttons)
    // ==========================================================================
    const newsTrack = document.getElementById('news-track');
    const newsPrev = document.getElementById('news-prev');
    const newsNext = document.getElementById('news-next');

    if (newsTrack) {
        // Clone cards for infinite effect
        const cards = Array.from(newsTrack.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            newsTrack.appendChild(clone);
        });

        // Start from the middle (which is the beginning of the cloned set) to allow left scroll immediately
        setTimeout(() => {
            newsTrack.style.scrollBehavior = 'auto';
            newsTrack.scrollLeft = newsTrack.scrollWidth / 2;
            newsTrack.style.scrollBehavior = 'smooth';
        }, 100);

        // Button controls
        const getCardWidth = () => {
            const card = newsTrack.querySelector('.news-card');
            const style = window.getComputedStyle(newsTrack);
            const gap = parseFloat(style.gap) || 0;
            return card.offsetWidth + gap;
        };

        newsPrev?.addEventListener('click', () => {
            newsTrack.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        });

        newsNext?.addEventListener('click', () => {
            newsTrack.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        });

        // Mouse Drag to Scroll
        let isDown = false;
        let startX;
        let scrollLeft;

        newsTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            newsTrack.style.cursor = 'grabbing';
            newsTrack.style.scrollSnapType = 'none'; // disable snap during drag
            newsTrack.style.scrollBehavior = 'auto'; // disable smooth scroll while dragging
            startX = e.pageX - newsTrack.offsetLeft;
            scrollLeft = newsTrack.scrollLeft;
        });

        newsTrack.addEventListener('mouseleave', () => {
            if (!isDown) return;
            isDown = false;
            newsTrack.style.cursor = 'grab';
            newsTrack.style.scrollSnapType = 'x mandatory';
            newsTrack.style.scrollBehavior = 'smooth';
        });

        newsTrack.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            newsTrack.style.cursor = 'grab';
            newsTrack.style.scrollSnapType = 'x mandatory';
            newsTrack.style.scrollBehavior = 'smooth';
        });

        newsTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - newsTrack.offsetLeft;
            const walk = (x - startX) * 2; // scroll-fast multiplier
            newsTrack.scrollLeft = scrollLeft - walk;
        });

        // Infinite Loop Logic
        newsTrack.addEventListener('scroll', () => {
            const maxScroll = newsTrack.scrollWidth / 2;
            
            // Allow a small buffer before jumping so it feels seamless
            if (newsTrack.scrollLeft >= maxScroll + getCardWidth()) {
                newsTrack.style.scrollBehavior = 'auto';
                newsTrack.scrollLeft -= maxScroll;
                if (isDown) scrollLeft -= maxScroll; // Update drag reference
                newsTrack.style.scrollBehavior = 'smooth';
            } else if (newsTrack.scrollLeft <= 0) {
                newsTrack.style.scrollBehavior = 'auto';
                newsTrack.scrollLeft += maxScroll;
                if (isDown) scrollLeft += maxScroll; // Update drag reference
                newsTrack.style.scrollBehavior = 'smooth';
            }
        });
    }

    // ==========================================================================
    // Particle Canvas Animation
    // ==========================================================================
    initParticleCanvas();
});

function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height, particles;
    
    // Brand Colors for particles
    const colors = [
        'rgba(214, 222, 237, 0.6)', // Azul Claro (#d6deed)
        'rgba(250, 165, 54, 0.6)',  // Laranja (#faa536)
        'rgba(255, 255, 255, 0.4)'  // Branco
    ];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    function init() {
        resize();
        particles = [];
        // Calculate particle count based on screen size (prevent lag on mobile)
        const particleCount = Math.min(Math.floor((width * height) / 10000), 100);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    // Line opacity based on distance
                    const opacity = 1 - (distance / 150);
                    // Mix colors or use a faint cyan
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(214, 222, 237, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        drawConnections();
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', init);
    init();
    animate();
}