document.addEventListener('DOMContentLoaded', () => {
    // Get canvas element
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle settings
    const particlesArray = [];
    const numberOfParticles = 100;
    
    // Mouse position
    const mouse = {
        x: null,
        y: null,
        radius: 150
    };

    // Track mouse position
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Create particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = this.getRandomColor();
        }

        // Get a random color from the game's color scheme
        getRandomColor() {
            const colors = [
                '#00c6c6', // Teal
                '#ff3a3a', // Red
                '#ffffff'  // White
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        // Update particle position and behavior
        update() {
            // Move particle
            this.x += this.speedX;
            this.y += this.speedY;

            // Interact with mouse
            if (mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.speedX -= force * Math.cos(angle) * 0.1;
                    this.speedY -= force * Math.sin(angle) * 0.1;
                }
            }

            // Slow down particles over time
            this.speedX *= 0.99;
            this.speedY *= 0.99;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX = -this.speedX;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY = -this.speedY;
            }
        }

        // Draw particle on canvas
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.7;
            ctx.fill();

            // Optional glow effect
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        // Check if particle should be reinitialized
        checkReset() {
            // If particle gets too slow, reset it
            if (Math.abs(this.speedX) < 0.1 && Math.abs(this.speedY) < 0.1) {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
            }
        }
    }

    // Initialize particles
    function init() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Optional background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1e2130');
        gradient.addColorStop(1, '#2d3150');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw and update each particle
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            particlesArray[i].checkReset();
            
            // Optional: connect nearby particles with lines
            connectParticles(particlesArray[i], particlesArray);
        }
        
        requestAnimationFrame(animate);
    }

    // Connect particles with lines if they're close enough
    function connectParticles(particle, particles) {
        for (let i = 0; i < particles.length; i++) {
            const dx = particle.x - particles[i].x;
            const dy = particle.y - particles[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = particle.color;
                ctx.globalAlpha = 0.1 * (1 - distance/150); // Fade based on distance
                ctx.lineWidth = 1;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particles[i].x, particles[i].y);
                ctx.stroke();
            }
        }
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Reinitialize particles when screen size changes
        particlesArray.length = 0;
        init();
    });

    // Initialize and start animation
    init();
    animate();
});