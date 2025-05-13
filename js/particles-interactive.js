class InteractiveParticles {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.trails = [];
        this.mouse = { x: 0, y: 0, radius: 150 };
        this.hue = 0;
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    setupCanvas() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '1';
        this.container.appendChild(this.canvas);
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    createParticles() {
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        this.particles = [];

        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                hue: Math.random() * 60 + 200, // Blue to purple range
                connections: []
            });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.handleResize());
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.container.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.container.addEventListener('click', (e) => this.createTrail(e));
    }

    handleResize() {
        this.resizeCanvas();
        this.createParticles();
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    handleMouseLeave() {
        this.mouse.x = undefined;
        this.mouse.y = undefined;
    }

    createTrail(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.trails.push({
            x,
            y,
            size: 50,
            alpha: 1,
            hue: this.hue
        });
    }

    drawConnections() {
        this.particles.forEach(particle => {
            particle.connections = [];
            this.particles.forEach(otherParticle => {
                if (particle === otherParticle) return;
                
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    particle.connections.push({
                        particle: otherParticle,
                        distance
                    });
                }
            });
        });

        this.particles.forEach(particle => {
            particle.connections.forEach(connection => {
                const alpha = 1 - (connection.distance / 100);
                this.ctx.beginPath();
                this.ctx.strokeStyle = `hsla(${particle.hue}, 100%, 50%, ${alpha * 0.5})`;
                this.ctx.lineWidth = 0.5;
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(connection.particle.x, connection.particle.y);
                this.ctx.stroke();
            });
        });
    }

    animate() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.hue = (this.hue + 0.5) % 360;

        // Update and draw trails
        this.trails.forEach((trail, index) => {
            trail.size *= 0.95;
            trail.alpha *= 0.96;
            
            if (trail.alpha < 0.01) {
                this.trails.splice(index, 1);
            } else {
                const gradient = this.ctx.createRadialGradient(
                    trail.x, trail.y, 0,
                    trail.x, trail.y, trail.size
                );
                gradient.addColorStop(0, `hsla(${trail.hue}, 100%, 50%, ${trail.alpha})`);
                gradient.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(trail.x - trail.size, trail.y - trail.size,
                                trail.size * 2, trail.size * 2);
            }
        });

        // Update and draw particles
        this.drawConnections();
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Boundary check with wrapping
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Mouse interaction
            if (this.mouse.x !== undefined) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    particle.speedX -= Math.cos(angle) * force * 0.2;
                    particle.speedY -= Math.sin(angle) * force * 0.2;
                }
            }

            // Speed limit
            const speed = Math.sqrt(particle.speedX * particle.speedX + 
                                  particle.speedY * particle.speedY);
            if (speed > 2) {
                particle.speedX *= 0.9;
                particle.speedY *= 0.9;
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsl(${particle.hue}, 100%, 50%)`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}
