import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst } from "../utils/particles.js";
import { RELATIONSHIP_DATA } from "../data/loveData.js";

export class LandingSectionComponent {
  constructor({ onEnterWorld, onOpenSoundPrompt }) {
    this.onEnterWorld = onEnterWorld;
    this.onOpenSoundPrompt = onOpenSoundPrompt;
  }

  render() {
    const section = document.createElement("section");
    section.id = "section-landing";
    section.className = "min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10 animate-fadeIn";

    section.innerHTML = `
      <div class="max-w-xl mx-auto flex flex-col items-center">
        <!-- Floating Greeting Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-200 text-xs md:text-sm font-semibold mb-6 animate-float shadow-[0_0_20px_rgba(244,63,94,0.3)]">
          <span>✨</span>
          <span>Made by Darshan for his Chanchal</span>
          <span>✨</span>
        </div>

        <!-- Pulsating Glowing Heart -->
        <div id="landing-heart-icon" class="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-pink-600/30 via-rose-500/40 to-purple-600/30 border border-pink-400/50 flex items-center justify-center text-5xl md:text-6xl mb-6 animate-heartbeat cursor-pointer shadow-[0_0_40px_rgba(244,63,94,0.4)] hover:scale-110 transition-transform">
          ❤️
        </div>

        <!-- Main Heading -->
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-gradient-rose tracking-tight leading-tight mb-2">
          Hey Bayko… ❤️
        </h1>

        <p class="text-xl md:text-2xl font-script text-pink-200/90 mb-4">
          Welcome to Our Little World
        </p>

        <!-- Emotional Subtitle -->
        <div class="glass-panel-subtle p-4 rounded-2xl max-w-md mx-auto mb-8 border border-purple-400/20">
          <p class="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-serif italic">
            “A tiny magical universe created just for you — where every flower, song, kiss, and memory was put together with all my heart.”
          </p>
          <div class="mt-2 text-[11px] text-pink-300/80 font-bold uppercase tracking-wider">
            ${RELATIONSHIP_DATA.identity.motto}
          </div>
        </div>

        <!-- Enter Journey Button -->
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
          <button id="landing-enter-btn" class="btn-romantic w-full text-sm md:text-base py-3.5 shadow-[0_0_25px_rgba(236,72,153,0.5)] cursor-pointer">
            <span>Enter Our World</span>
            <span class="text-lg">✨</span>
          </button>
        </div>

        <!-- Footnote / Hint -->
        <p class="text-[11px] text-purple-300/60 mt-8 flex items-center gap-1">
          <span>👑</span>
          <span>For my cute little princess Coco</span>
        </p>
      </div>
    `;

    setTimeout(() => {
      const enterBtn = document.getElementById("landing-enter-btn");
      const heartIcon = document.getElementById("landing-heart-icon");

      const handleEnter = (e) => {
        audioManager.playRomanticTone(523.25, 1.2, "sine", 0.15);
        audioManager.playSparkle();
        spawnHeartBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 20, ["❤️", "💖", "🌸", "✨", "👑"]);
        if (this.onEnterWorld) {
          this.onEnterWorld();
        }
      };

      if (enterBtn) enterBtn.addEventListener("click", handleEnter);
      if (heartIcon) {
        heartIcon.addEventListener("click", (e) => {
          audioManager.playKissSound();
          spawnHeartBurst(e.clientX, e.clientY, 15, ["❤️", "💋", "💖", "✨"]);
        });
      }
    }, 50);

    return section;
  }
}
