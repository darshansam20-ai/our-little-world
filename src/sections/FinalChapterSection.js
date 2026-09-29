import { FINAL_GRAND_MESSAGE } from "../data/letters.js";
import { audioManager } from "../utils/audioManager.js";
import { triggerCelebrationConfetti, spawnHeartBurst } from "../utils/particles.js";

export class FinalChapterSectionComponent {
  constructor({ onUnlockAchievement, onRestartJourney }) {
    this.onUnlockAchievement = onUnlockAchievement;
    this.onRestartJourney = onRestartJourney;
    this.stepIndex = 0;
  }

  render() {
    const section = document.createElement("section");
    section.id = "section-final";
    section.className = "min-h-screen py-16 px-4 md:px-6 relative z-10 flex flex-col items-center justify-center animate-fadeIn text-center";

    section.innerHTML = `
      <div class="max-w-xl w-full mx-auto">
        
        <!-- Slow Pulsing Sacred Heart -->
        <div class="w-20 h-20 mx-auto rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-4xl mb-6 animate-heartbeat shadow-[0_0_50px_rgba(244,63,94,0.5)]">
          💍
        </div>

        <!-- Section Intro -->
        <span class="text-xs uppercase tracking-widest text-pink-300 font-bold block mb-1">Chapter 07 • The Climax</span>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-gradient-rose mb-6">
          One Last Thing…
        </h1>

        <!-- Cinematic Step Reveal Card -->
        <div id="final-cinematic-card" class="glass-panel p-6 sm:p-10 border border-pink-400/40 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#180924]/95 via-[#12061c]/95 to-[#09020e]/95 text-left mb-8">
          
          <div class="space-y-4 text-sm sm:text-base text-purple-100/90 font-serif leading-relaxed">
            <p class="animate-fadeIn">You explored my little world.</p>
            <p class="animate-fadeIn" style="animation-delay: 0.3s">You opened my letters.</p>
            <p class="animate-fadeIn" style="animation-delay: 0.6s">You collected flowers.</p>
            <p class="animate-fadeIn" style="animation-delay: 0.9s">You sent kisses.</p>
            <p class="animate-fadeIn" style="animation-delay: 1.2s">You played my silly little games.</p>
            <p class="animate-fadeIn" style="animation-delay: 1.5s">You found my secrets.</p>
            <p class="animate-fadeIn" style="animation-delay: 1.8s">You remembered our memories.</p>

            <div class="pt-4 border-t border-white/10 space-y-3">
              <p class="font-bold text-pink-300 text-base sm:text-lg animate-fadeIn" style="animation-delay: 2.2s">
                “But I made all of this for one simple reason.”
              </p>
              
              <h2 class="text-2xl sm:text-3xl font-heading font-extrabold text-gradient-rose py-2 animate-fadeIn" style="animation-delay: 2.6s">
                Because you are important to me.
              </h2>

              <p class="text-xs sm:text-sm text-purple-200/80 italic animate-fadeIn" style="animation-delay: 2.9s">
                More than I can fit into a website. More than I can fit into a letter. More than I can explain properly.
              </p>
            </div>

            <!-- The Sacred Identity Badges -->
            <div class="pt-6 space-y-2 text-center">
              <span class="block text-xl sm:text-2xl font-script text-pink-200 font-bold">You are my favorite person.</span>
              <span class="block text-xl sm:text-2xl font-script text-pink-200 font-bold">My safe place.</span>
              <span class="block text-2xl sm:text-3xl font-script text-pink-300 font-bold">My Coco.</span>
              <span class="block text-2xl sm:text-3xl font-script text-pink-300 font-bold">My Bayko.</span>
              <span class="block text-2xl sm:text-3xl font-script text-pink-200 font-bold">My Humsafar.</span>
              <span class="block text-2xl sm:text-3xl font-script text-pink-200 font-bold">My home.</span>
              <span class="block text-3xl sm:text-4xl font-script text-gradient-rose font-bold py-2">My forever.</span>
            </div>

            <div class="text-center pt-4">
              <h3 class="text-3xl sm:text-4xl font-heading font-extrabold text-gradient-rose">
                I love you. ❤️
              </h3>
            </div>
          </div>

          <!-- Full Personal Message Accordion / Reveal -->
          <div class="mt-8 pt-6 border-t border-white/10">
            <h4 class="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold mb-3 text-center">
              Darshan's Final Letter for Chanchal
            </h4>

            <div class="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 font-handwritten text-base sm:text-lg text-pink-100 font-semibold space-y-3 leading-relaxed">
              <p class="text-xl font-script text-pink-300 font-bold">${FINAL_GRAND_MESSAGE.recipient}</p>
              <p>${FINAL_GRAND_MESSAGE.opening}</p>
              <p>${FINAL_GRAND_MESSAGE.middle}</p>
              
              <div class="space-y-1 py-2 pl-2 border-l-2 border-pink-400/40 text-sm sm:text-base font-body text-purple-100">
                ${FINAL_GRAND_MESSAGE.bulletPoints.map(b => `
                  <div>• ${b}</div>
                `).join("")}
              </div>

              <p class="text-lg font-bold text-pink-300 pt-2">${FINAL_GRAND_MESSAGE.climax}</p>

              ${FINAL_GRAND_MESSAGE.vows.map(v => `
                <p>${v}</p>
              `).join("")}

              <p class="text-lg text-pink-200 font-bold pt-2">${FINAL_GRAND_MESSAGE.closing}</p>

              <div class="pt-4 flex flex-col items-end">
                <span class="text-xs font-mono text-purple-300/80">${FINAL_GRAND_MESSAGE.signOff}</span>
                <span class="text-2xl font-script text-pink-300 font-bold">${FINAL_GRAND_MESSAGE.author}</span>
                <span class="text-xs font-mono text-pink-400 mt-1">${FINAL_GRAND_MESSAGE.date}</span>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-200 border border-pink-400/30 mt-1">${FINAL_GRAND_MESSAGE.badge}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Start Story Again & Celebrate -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button id="final-replay-btn" class="btn-secondary-romantic text-xs sm:text-sm py-3 px-6 w-full sm:w-auto">
            ↺ Start Our Story Again
          </button>
          <button id="final-celebrate-btn" class="btn-romantic text-xs sm:text-sm py-3 px-8 w-full sm:w-auto shadow-[0_0_25px_rgba(244,63,94,0.7)]">
            <span>Shower Love & Hearts</span>
            <span>💖</span>
          </button>
        </div>

        <p class="text-[11px] text-purple-300/60 mt-8 font-script text-lg">
          “Hum Navra-Bayko hain. Forever & Always. ❤️”
        </p>

      </div>
    `;

    setTimeout(() => {
      // Trigger achievement
      if (this.onUnlockAchievement) {
        this.onUnlockAchievement("forever");
      }

      // Initial romantic celebration fanfare
      audioManager.playCelebrationChord();
      triggerCelebrationConfetti();

      const replayBtn = document.getElementById("final-replay-btn");
      const celebrateBtn = document.getElementById("final-celebrate-btn");

      if (replayBtn && this.onRestartJourney) {
        replayBtn.addEventListener("click", () => {
          this.onRestartJourney();
        });
      }

      if (celebrateBtn) {
        celebrateBtn.addEventListener("click", (e) => {
          audioManager.playKissSound();
          triggerCelebrationConfetti();
          spawnHeartBurst(e.clientX, e.clientY, 30, ["💍", "❤️", "💖", "🌸", "👑", "✨", "💋"]);
        });
      }
    }, 50);

    return section;
  }
}
