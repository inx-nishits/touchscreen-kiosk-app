/**
 * Intro Animation Module
 * Creates a premium particle animation for the transition.
 */

const IntroAnimation = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    
    init() {
        this.canvas = document.getElementById('intro-particles');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    
    start() {
        console.log('Intro Animation Started');
        
        const video = document.getElementById('intro-video');
        if (video) {
            video.currentTime = 0;
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("Intro video playback failed, skipping to map...", error);
                    KioskState.transitionTo(KioskState.MAP);
                });
            }
            
            // Transition to map when video ends
            video.onended = () => {
                KioskState.transitionTo(KioskState.MAP);
            };

            // Emergency fallback for very long videos or playback issues
            // If nothing happens for 60 seconds, go to map anyway
            this.fallbackTimer = setTimeout(() => {
                if (KioskState.currentState === KioskState.INTRO) {
                    console.warn("Intro video timed out, forcing transition to map.");
                    KioskState.transitionTo(KioskState.MAP);
                }
            }, 60000); 
        } else {
            // No video? Go straight to map
            KioskState.transitionTo(KioskState.MAP);
        }

        this.particles = [];
        for (let i = 0; i < 150; i++) {
            this.particles.push(this.createParticle());
        }
        this.animate();
    },
    
    stop() {
        if (this.fallbackTimer) clearTimeout(this.fallbackTimer);
        
        const video = document.getElementById('intro-video');
        if (video) {
            video.pause();
            video.onended = null;
        }

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    },
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 1,
            color: `rgba(212, 175, 55, ${Math.random() * 0.5 + 0.2})`
        };
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
};

window.IntroAnimation = IntroAnimation;
