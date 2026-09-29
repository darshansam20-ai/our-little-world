import { SURPRISE_DATA } from "../data/surprises.js";
import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst, triggerCelebrationConfetti } from "../utils/particles.js";

export class SurpriseBoxSectionComponent {
  constructor({ hasAcceptedSurprise = false, onAcceptSurprise, onNextSection }) {
    this.hasAccepted = hasAcceptedSurprise;
    this.onAcceptSurprise = onAcceptSurprise;
    this.onNextSection = onNextSection;
    this.stage = 0; // 0: closed, 1: initial reveal, 2: grand coupon reveal
  }

  render() {
    const section = document.createElement("section");
    section.id = "section-surprise";
    section.className = "min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative z-10 animate-fadeIn";

    section.innerHTML = `
      <div class="max-w-xl w-full mx-auto text-center">
        <!-- Header -->
        <div class="mb-5">
          <span class="text-3xl inline-block mb-1 animate-float">🎁</span>
          <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-gradient-rose">${SURPRISE_DATA.title}</h1>
          <p class="text-xs text-purple-200/80 mt-1">A glowing gift prepared specially for you</p>
        </div>

        <!-- Interactive Gift Box Container -->
        <div id="surprise-stage-box" class="glass-panel p-6 sm:p-8 mb-6 border border-pink-400/40 shadow-2xl relative overflow-hidden bg-gradient-to-b from-purple-950/80 to-pink-950/80">
          
          <!-- Stage 0: Glowing Closed Present Box -->
          <div id="gift-box-closed" class="flex flex-col items-center justify-center py-6 cursor-pointer group hover:scale-105 transition-transform">
            <div class="relative w-32 h-32 sm:w-40 sm:h-40 mb-4 flex items-center justify-center">
              <div class="absolute inset-0 rounded-full bg-pink-500/20 blur-xl group-hover:bg-pink-500/40 transition-all animate-pulseGlow"></div>
              <span class="text-7xl sm:text-8xl select-none filter drop-shadow-[0_10px_20px_rgba(244,63,94,0.4)] animate-bounce">
                🎁
              </span>
            </div>

            <h3 class="text-lg font-bold text-pink-200 mb-1">Tap To Open Your Gift</h3>
            <p class="text-xs text-purple-200/70">What could be inside?</p>
          </div>

          <!-- Stage 1: Initial Reveal Preview (Hidden initially) -->
          <div id="gift-box-stage-1" class="hidden flex flex-col items-center py-4 animate-fadeIn">
            <span class="text-4xl mb-2">✨</span>
            <h3 class="text-xl font-heading font-bold text-gradient-rose mb-1">${SURPRISE_DATA.initialReveal}</h3>
            <p class="text-xs sm:text-sm text-purple-200/90 mb-5 font-serif italic">${SURPRISE_DATA.secondaryPrompt}</p>

            <button id="surprise-stage-1-btn" class="btn-romantic text-xs sm:text-sm py-3 px-8 shadow-xl">
              <span>Unveil The Grand Surprise</span>
              <span>✨</span>
            </button>
          </div>

          <!-- Stage 2: Grand Certificate Reveal (Hidden initially) -->
          <div id="gift-box-stage-2" class="hidden flex flex-col items-center text-left space-y-4 animate-fadeIn">
            <div class="text-center w-full border-b border-white/10 pb-3">
              <span class="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">Official Couple Agreement</span>
              <h2 class="text-xl sm:text-2xl font-heading font-extrabold text-gradient-rose mt-1">
                ${SURPRISE_DATA.grandSurprise.heading}
              </h2>
            </div>

            <!-- List of perks -->
            <div class="space-y-2 w-full p-4 rounded-2xl bg-white/5 border border-white/10">
              ${SURPRISE_DATA.grandSurprise.items.map(item => `
                <div class="flex items-center gap-2.5 text-xs text-purple-100 font-medium">
                  <span class="text-pink-400 text-sm">❤️</span>
                  <span>${item}</span>
                </div>
              `).join("")}
            </div>

            <!-- Terms and conditions -->
            <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-center w-full">
              <p class="text-xs font-handwritten text-amber-200 font-bold">
                ${SURPRISE_DATA.grandSurprise.termsAndConditions}
              </p>
            </div>

            <!-- Accept Forever Button -->
            <div class="w-full text-center pt-2">
              <button id="surprise-accept-btn" class="btn-romantic w-full text-xs sm:text-sm py-3.5 shadow-xl">
                <span>${SURPRISE_DATA.grandSurprise.buttonText}</span>
              </button>
              <div id="surprise-accepted-msg" class="hidden mt-3 p-2.5 rounded-xl bg-pink-500/20 text-pink-200 text-xs font-bold animate-fadeIn">
                ${SURPRISE_DATA.grandSurprise.acceptedMessage}
              </div>
            </div>
          </div>

        </div>

        <!-- Continue Button to Grand Climax -->
        <div id="surprise-continue-wrapper" class="hidden flex items-center justify-center gap-3">
          <button id="surprise-final-btn" class="btn-romantic text-xs sm:text-sm py-3.5 px-8 shadow-[0_0_25px_rgba(244,63,94,0.7)]">
            <span>One Last Thing… ❤️</span>
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      const closedBox = document.getElementById("gift-box-closed");
      const stage1 = document.getElementById("gift-box-stage-1");
      const stage1Btn = document.getElementById("surprise-stage-1-btn");
      const stage2 = document.getElementById("gift-box-stage-2");
      const acceptBtn = document.getElementById("surprise-accept-btn");
      const acceptedMsg = document.getElementById("surprise-accepted-msg");
      const contWrapper = document.getElementById("surprise-continue-wrapper");
      const finalBtn = document.getElementById("surprise-final-btn");

      if (closedBox) {
        closedBox.addEventListener("click", (e) => {
          audioManager.playSparkle();
          spawnHeartBurst(e.clientX, e.clientY, 15, ["🎁", "✨", "💖", "🌸"]);
          closedBox.classList.add("hidden");
          stage1.classList.remove("hidden");
        });
      }

      if (stage1Btn) {
        stage1Btn.addEventListener("click", (e) => {
          audioManager.playCelebrationChord();
          triggerCelebrationConfetti();
          spawnHeartBurst(e.clientX, e.clientY, 20, ["🎉", "❤️", "💍", "👑"]);
          stage1.classList.add("hidden");
          stage2.classList.remove("hidden");
          contWrapper.classList.remove("hidden");
        });
      }

      if (acceptBtn) {
        acceptBtn.addEventListener("click", (e) => {
          audioManager.playKissSound();
          triggerCelebrationConfetti();
          spawnHeartBurst(e.clientX, e.clientY, 25, ["💍", "❤️", "💋", "✨", "👑"]);
          if (acceptedMsg) acceptedMsg.classList.remove("hidden");
          acceptBtn.disabled = true;
          acceptBtn.classList.add("opacity-50", "pointer-events-none");
          if (this.onAcceptSurprise) {
            this.onAcceptSurprise();
          }
        });
      }

      if (finalBtn) {
        finalBtn.addEventListener("click", () => {
          audioManager.playRomanticTone(523.25, 0.6);
          if (this.onNextSection) {
            this.onNextSection("final");
          }
        });
      }
    }, 50);

    return section;
  }
}
