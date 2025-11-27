/**
 * Animated Background Effects
 * Creates subtle, ambient visual effects inspired by Brain.fm
 */

class BackgroundEffects {
  constructor() {
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.init();
  }

  init() {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'bg-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '0';
    this.canvas.style.opacity = '0.4';
    
    // Insert canvas at the beginning of body
    document.body.insertBefore(this.canvas, document.body.firstChild);
    
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createParticles();
    
    // Event listeners
    window.addEventListener('resize', () => this.resize());
    
    // Start animation
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const particleCount = Math.min(50, Math.floor((this.canvas.width * this.canvas.height) / 20000));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.getRandomColor()
      });
    }
  }

  getRandomColor() {
    const colors = [
      'rgba(0, 212, 255, ',  // Primary accent
      'rgba(255, 107, 53, ', // Secondary accent
      'rgba(184, 193, 236, ' // Text secondary
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw particles
    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Draw particle
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 4
      );
      gradient.addColorStop(0, particle.color + particle.opacity + ')');
      gradient.addColorStop(1, particle.color + '0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw connections to nearby particles
      this.particles.forEach((otherParticle, otherIndex) => {
        if (index !== otherIndex) {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const lineOpacity = (1 - distance / 150) * 0.15;
            this.ctx.strokeStyle = `rgba(184, 193, 236, ${lineOpacity})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(otherParticle.x, otherParticle.y);
            this.ctx.stroke();
          }
        }
      });
    });
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Gradient animation for hero sections
class GradientAnimation {
  constructor(element) {
    this.element = element;
    this.hue = 0;
    this.animate();
  }

  animate() {
    this.hue = (this.hue + 0.1) % 360;
    
    const gradient = `
      linear-gradient(
        135deg,
        hsl(${this.hue}, 70%, 20%) 0%,
        hsl(${(this.hue + 60) % 360}, 60%, 15%) 50%,
        hsl(${(this.hue + 120) % 360}, 70%, 18%) 100%
      )
    `;
    
    this.element.style.background = gradient;
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on page load if user hasn't requested reduced motion
function initBackgroundEffects() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    // Initialize particle background
    const bgEffects = new BackgroundEffects();
    
    // Store reference for cleanup
    window.bgEffects = bgEffects;
    
    // Animate gradient backgrounds on hero sections
    document.querySelectorAll('.hero-gradient').forEach(element => {
      new GradientAnimation(element);
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackgroundEffects);
} else {
  initBackgroundEffects();
}

// Export for manual initialization
export { BackgroundEffects, GradientAnimation, initBackgroundEffects };
