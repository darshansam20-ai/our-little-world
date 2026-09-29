import { AmbientBackgroundEngine, spawnHeartBurst } from "../utils/particles.js";
import { EASTER_EGGS } from "../data/easterEggs.js";
import { audioManager } from "../utils/audioManager.js";

export class AmbientBackgroundComponent {
  constructor(onSecretTriggered) {
    this.onSecretTriggered = onSecretTriggered;
    this.engine = null;
  }

  render() {
    const container = document.createElement("div");
    container.className = "fixed inset-0 pointer-events-none z-0 overflow-hidden";
    container.innerHTML = `
      <canvas id="ambient-canvas" class="absolute inset-0 w-full h-full"></canvas>
      
      <!-- Ambient Glowing Nebula Orbs -->
      <div class="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl animate-float"></div>
      <div class="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-pink-600/10 blur-3xl animate-float" style="animation-delay: -2.5s;"></div>
      
      <!-- Interactive Easter Egg Moon -->
      <div id="secret-moon" class="pointer-events-auto absolute top-6 right-6 md:top-8 md:right-12 cursor-pointer transition-all duration-500 hover:scale-110 active:scale-95 group" title="A tiny crescent moon in your sky">
        <div class="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-amber-100 via-yellow-100 to-amber-200/90 shadow-[0_0_25px_rgba(254,240,138,0.5)] flex items-center justify-center border border-amber-200/40">
          <span class="text-xl md:text-2xl select-none group-hover:rotate-12 transition-transform duration-300">🌙</span>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-pink-400/80 blur-xs animate-ping"></div>
        </div>
      </div>
      
      <!-- Floating Little Cookie Easter Egg (Coco Eating Modak trigger) -->
      <div id="secret-cookie" class="pointer-events-auto absolute bottom-6 left-6 md:bottom-8 md:left-12 cursor-pointer opacity-40 hover:opacity-100 transition-all duration-300 hover:scale-125 group" title="Protect the Modak!">
        <span class="text-2xl select-none group-hover:animate-bounce inline-block">🥟</span>
      </div>
    `;

    setTimeout(() => {
      const canvas = document.getElementById("ambient-canvas");
      if (canvas) {
        this.engine = new AmbientBackgroundEngine(canvas);
        this.engine.start();
      }

      // Moon click listener
      const moon = document.getElementById("secret-moon");
      if (moon) {
        moon.addEventListener("click", (e) => {
          audioManager.playSparkle();
          spawnHeartBurst(e.clientX, e.clientY, 12, ["🌙", "✨", "⭐", "💛", "🥰"]);
          if (this.onSecretTriggered) {
            this.onSecretTriggered("moon", EASTER_EGGS.moon);
          }
        });
      }

      // Secret Modak/Cookie click listener
      const cookie = document.getElementById("secret-cookie");
      if (cookie) {
        cookie.addEventListener("click", (e) => {
          audioManager.playSparkle();
          spawnHeartBurst(e.clientX, e.clientY, 10, ["🥟", "😋", "😂", "❤️", "⚠️"]);
          if (this.onSecretTriggered) {
            this.onSecretTriggered("eatModakCookie", EASTER_EGGS.eatModakCookie);
          }
        });
      }
    }, 50);

    return container;
  }
}
