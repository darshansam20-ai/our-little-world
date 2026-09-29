/**
 * ✨ PARTICLES & AMBIENT VISUAL EFFECTS
 * Canvas petals, twinkling night sky stars, floating heart bursts, and confetti.
 */

export class AmbientBackgroundEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext("2d") : null;
    this.petals = [];
    this.stars = [];
    this.animationFrame = null;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.handleResize = this.resize.bind(this);
  }

  start() {
    if (!this.canvas || !this.ctx) return;
    this.resize();
    window.addEventListener("resize", this.handleResize);
    this.initStars(40);
    this.initPetals(25);
    this.loop();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  initStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  initPetals(count) {
    this.petals = [];
    for (let i = 0; i < count; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 12 + 8,
        speedY: Math.random() * 0.8 + 0.4,
        speedX: Math.random() * 0.6 - 0.3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        color: i % 2 === 0 ? "rgba(251, 113, 133, 0.4)" : "rgba(244, 114, 182, 0.35)",
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
  }

  loop() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw twinkling stars
    for (const star of this.stars) {
      star.phase += star.twinkleSpeed;
      const currentAlpha = star.alpha + Math.sin(star.phase) * 0.3;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, currentAlpha)})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw falling rose petals
    for (const petal of this.petals) {
      petal.y += petal.speedY;
      petal.x += Math.sin(petal.y * 0.01) * 0.5 + petal.speedX;
      petal.rotation += petal.rotationSpeed;

      if (petal.y > this.height + 20) {
        petal.y = -20;
        petal.x = Math.random() * this.width;
      }
      if (petal.x > this.width + 20) petal.x = -20;
      if (petal.x < -20) petal.x = this.width + 20;

      this.ctx.save();
      this.ctx.translate(petal.x, petal.y);
      this.ctx.rotate((petal.rotation * Math.PI) / 180);
      this.ctx.fillStyle = petal.color;
      this.ctx.beginPath();
      // Draw petal curve
      this.ctx.ellipse(0, 0, petal.size * 0.6, petal.size, Math.PI / 4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    this.animationFrame = requestAnimationFrame(this.loop.bind(this));
  }

  destroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

// Tap / Click Heart Burst Effect
export function spawnHeartBurst(x, y, count = 10, emojis = ["❤️", "💖", "💋", "🌸", "✨"]) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "floating-burst-emoji pointer-events-none fixed select-none text-2xl z-50 transition-all";
    el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = `translate(-50%, -50%) scale(0.5)`;
    el.style.opacity = "1";
    document.body.appendChild(el);

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const distance = Math.random() * 80 + 40;
    const targetX = x + Math.cos(angle) * distance;
    const targetY = y + Math.sin(angle) * distance - 50;

    requestAnimationFrame(() => {
      el.style.transition = "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s ease";
      el.style.left = `${targetX}px`;
      el.style.top = `${targetY}px`;
      el.style.transform = `translate(-50%, -50%) scale(${Math.random() * 0.8 + 0.8}) rotate(${Math.random() * 60 - 30}deg)`;
      el.style.opacity = "0";
    });

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1000);
  }
}

// Celebration Confetti Cannon
export function triggerCelebrationConfetti() {
  const colors = ["#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#f59e0b", "#fb7185", "#ffffff"];
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement("div");
    confetti.className = "fixed pointer-events-none z-50 rounded-sm";
    const size = Math.random() * 8 + 6;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size * 0.6}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = `-20px`;
    confetti.style.opacity = "1";
    document.body.appendChild(confetti);

    const duration = Math.random() * 2000 + 1500;
    const fallDistance = window.innerHeight + 50;
    const horizontalSway = (Math.random() - 0.5) * 200;

    confetti.animate([
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${horizontalSway}px, ${fallDistance}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], {
      duration: duration,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      fill: "forwards"
    });

    setTimeout(() => {
      if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
    }, duration);
  }
}
