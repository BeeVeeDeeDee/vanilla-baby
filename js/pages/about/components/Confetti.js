import * as Create from '@/js/utils/dom-elements.js';
const confettiColors = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"];

export class Confetti {
  constructor() {
    Object.assign(this, {
      maxParticleCount: 150,
      particleSpeed: 2,
      colors: confettiColors,
      width: window.innerWidth,
      height: window.innerHeight,
      streamingConfetti: false,
      animationTimer: null,
      particles: [],
      waveAngle: 0,
      runAnimation: this.runAnimation.bind(this)
    });
    this.render();
  }

  render() {
    this.canvas = Create.Elements.CANVAS(document.body, 'confetti-canvas', this.width, this.height);
    window.addEventListener("resize", () => this.handleResize(), true);
    this.context = this.canvas.getContext("2d");
    this.generateParticles();
  }

  generateParticles() {
    while (this.particles.length < this.maxParticleCount) {
      this.particles.push(this.resetParticle({}, this.width, this.height));
    }
  }

  resetParticle(particle, width, height) {
    particle.color = this.colors[(Math.random() * this.colors.length) | 0];
    particle.x = Math.random() * width;
    particle.y = Math.random() * height - height;
    particle.diameter = Math.random() * 10 + 5;
    particle.tilt = Math.random() * 10 - 10;
    particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
    particle.tiltAngle = 0;
    return particle;
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  startConfetti() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    window.requestAnimFrame = (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 16.6666667);
      }
    );

    if (this.canvas === null) {
      this.render();
    }

    this.generateParticles();
    this.streamingConfetti = true;

    if (this.animationTimer === null) {
      this.animationTimer = window.requestAnimFrame(this.runAnimation);
    }
  }

  stopConfetti() {
    this.streamingConfetti = false;
  }

  removeConfett() {
    this.stopConfetti();
    this.particles = [];
  }

  toggleConfetti() {
    if (this.streamingConfetti) {
      this.stopConfetti();
    } else {
      this.startConfetti();
    }
  }

  drawParticles(context) {
    this.particles.forEach(({ diameter, color, x, tilt, y }) => {
      context.beginPath();
      context.lineWidth = diameter;
      context.strokeStyle = color;
      context.moveTo(x + tilt + diameter / 2, y);
      context.lineTo(x + tilt, y + tilt + diameter / 2);
      context.stroke();
    });
  }

  updateParticles() {
    this.waveAngle += 0.01;
    this.particles = this.particles.filter((particle, i) => {
      if (!this.streamingConfetti && particle.y < -15) particle.y = this.height + 100;
      else {
        particle.tiltAngle += particle.tiltAngleIncrement;
        particle.x += Math.sin(this.waveAngle);
        particle.y += (Math.cos(this.waveAngle) + particle.diameter + this.particleSpeed) * 0.5;
        particle.tilt = Math.sin(particle.tiltAngle) * 15;
      }
      if (particle.x > this.width + 20 || particle.x < -20 || particle.y > this.height) {
        if (this.streamingConfetti && this.particles.length <= this.maxParticleCount) this.resetParticle(particle, this.width, this.height);
        else return false;
      }
      return true;
    });
  }

  runAnimation() {
    this.context.clearRect(0, 0, this.width, this.height);
    if (this.particles.length) {
      this.updateParticles();
      this.drawParticles(this.context);
      this.animationTimer = requestAnimationFrame(() => this.runAnimation());
    } else {
      this.animationTimer = null;
    }
  }
}