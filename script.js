document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const hamburger = document.querySelector('.hamburger');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (hamburger) {
                        hamburger.querySelector('i').classList.add('fa-bars');
                        hamburger.querySelector('i').classList.remove('fa-times');
                    }
                }
            }
        });
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate skill bars
                if (entry.target.id === 'skills' || entry.target.querySelector('.skill-progress')) {
                    const skillBars = entry.target.querySelectorAll('.skill-progress');
                    skillBars.forEach(bar => {
                        const targetWidth = bar.style.width;
                        bar.style.transition = 'none';
                        bar.style.width = '0';
                        void bar.offsetWidth; // Force reflow
                        bar.style.transition = 'width 1s ease-out';
                        bar.style.width = targetWidth;
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .card, .timeline-item, .project-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Navbar scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 5, 5, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(5, 5, 5, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // Particle System
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor(x, y, isBurst = false, isTrail = false) {
                this.x = x || Math.random() * canvas.width;
                this.y = y || Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.1})`; // Blueish

                if (isBurst) {
                    this.speedX = (Math.random() - 0.5) * 8;
                    this.speedY = (Math.random() - 0.5) * 8;
                    this.size = Math.random() * 3 + 1;
                    this.life = 100;
                    this.color = `rgba(139, 92, 246, ${Math.random() * 0.8 + 0.2})`; // Purpleish
                } else if (isTrail) {
                    this.speedX = (Math.random() - 0.5) * 2;
                    this.speedY = (Math.random() - 0.5) * 2;
                    this.size = Math.random() * 2 + 0.5;
                    this.life = 50; // Shorter life for trail
                    this.color = `rgba(59, 130, 246, ${Math.random() * 0.6 + 0.4})`; // Brighter blue
                }
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges for normal particles
                if (this.life === undefined) {
                    if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                    if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
                } else {
                    // Burst/Trail particles fade out
                    this.life--;
                    this.size *= 0.95;
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                if (particles[i].life !== undefined && particles[i].life <= 0) {
                    particles.splice(i, 1);
                    i--;
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();

        // Click interaction
        document.addEventListener('click', (e) => {
            for (let i = 0; i < 15; i++) {
                particles.push(new Particle(e.clientX, e.clientY, true));
            }
        });

        // Mouse move interaction (Trail)
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            // Spawn a few particles at mouse position
            for (let i = 0; i < 2; i++) {
                particles.push(new Particle(mouse.x, mouse.y, false, true));
            }
        });
    }
});
