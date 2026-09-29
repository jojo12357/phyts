// core.js - Application state and core functionality
const PHYSLAB = {
    state: {
        labs: {
            uniform: { v0: 10, time: 5, accel: 2, measurements: [] },
            projectile: { v0: 20, angle: 45, gravity: 9.8, measurements: [] },
            pendulum: { length: 1, period: 2, measurements: [] },
            wave: { wavelength: 2, frequency: 5, measurements: [] }
        },
        solarSystem: {
            paused: false,
            planets: []
        },
        ui: {
            hamburgerActive: false,
            modalActive: false
        }
    },

    init() {
        this.setupNavigation();
        this.setupHeroVisual();
        this.setupSolarSystem();
        this.setupLaboratories();
        this.setupEventListeners();
        
        console.log('PHYSLAB AI initialized successfully');
    },

    setupNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        hamburger.addEventListener('click', () => {
            this.state.ui.hamburgerActive = !this.state.ui.hamburgerActive;
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                this.state.ui.hamburgerActive = false;
            });
        });
    },

    setupHeroVisual() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Create particles
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.color = `rgba(0, 212, 255, ${Math.random() * 0.5 + 0.2})`;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Initialize particles
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance/100)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    },

    setupSolarSystem() {
        const canvas = document.getElementById('solarCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Resize canvas
        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = Math.min(600, container.clientWidth * 0.75);
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Planet class
        class Planet {
            constructor(name, radius, distance, color, orbitalSpeed, size) {
                this.name = name;
                this.radius = radius;
                this.distance = distance;
                this.color = color;
                this.orbitalSpeed = orbitalSpeed;
                this.size = size;
                this.angle = Math.random() * Math.PI * 2;
            }
            
            update() {
                if (!this.state.solarSystem.paused) {
                    this.angle += this.orbitalSpeed;
                }
            }
            
            draw(ctx, sunX, sunY) {
                const x = sunX + Math.cos(this.angle) * this.distance;
                const y = sunY + Math.sin(this.angle) * this.distance * 0.4; // Elliptical orbit
                
                // Draw orbit
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.beginPath();
                ctx.ellipse(sunX, sunY, this.distance, this.distance * 0.4, 0, 0, Math.PI * 2);
                ctx.stroke();
                
                // Draw planet
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(x, y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Add glow effect
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
                
                // Draw label
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.font = '12px Exo 2';
                ctx.fillText(this.name, x - 15, y - this.size - 10);
            }
        }
        
        // Initialize planets
        const planets = [
            new Planet('Меркурий', 0.4, 60, '#A9A9A9', 0.01, 4),
            new Planet('Венера', 0.7, 90, '#FFA500', 0.007, 7),
            new Planet('Жердеу', 0.8, 120, '#4CAF50', 0.005, 8),
            new Planet('Марс', 0.6, 150, '#FF4500', 0.004, 6),
            new Planet('Юпитер', 2, 200, '#DAA520', 0.002, 18),
            new Planet('Сатурн', 1.8, 260, '#F0E68C', 0.001, 15),
            new Planet('Уран', 1.4, 320, '#AFEEEE', 0.0008, 12),
            new Planet('Нептун', 1.3, 380, '#4169E1', 0.0006, 11)
        ];
        
        this.state.solarSystem.planets = planets;
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw stars
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const size = Math.random() * 2;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Draw sun
            const sunX = canvas.width / 2;
            const sunY = canvas.height / 2;
            
            // Sun glow
            const gradient = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 60);
            gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(sunX, sunY, 60, 0, Math.PI * 2);
            ctx.fill();
            
            // Sun core
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(sunX, sunY, 20, 0, Math.PI * 2);
            ctx.fill();
            
            // Update and draw planets
            planets.forEach(planet => {
                planet.update();
                planet.draw(ctx, sunX, sunY);
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    },

    setupLaboratories() {
        // This will be expanded in simulations.js
        console.log('Laboratories setup initiated');
    },

    setupEventListeners() {
        // Solar system controls
        document.getElementById('solar-pause')?.addEventListener('click', () => {
            this.state.solarSystem.paused = true;
        });
        
        document.getElementById('solar-resume')?.addEventListener('click', () => {
            this.state.solarSystem.paused = false;
        });
        
        document.getElementById('solar-reset')?.addEventListener('click', () => {
            this.state.solarSystem.planets.forEach(planet => {
                planet.angle = Math.random() * Math.PI * 2;
            });
        });
        
        // Modal close buttons
        document.querySelectorAll('[data-close]').forEach(button => {
            button.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-close');
                this.closeModal(modalId);
            });
        });
        
        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            this.state.ui.modalActive = false;
            document.body.style.overflow = 'auto';
        }
    },

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            this.state.ui.modalActive = true;
            document.body.style.overflow = 'hidden';
        }
    }
};
