import { ENVELOPE_LETTER } from "../data/letters.js";
import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst, triggerCelebrationConfetti } from "../utils/particles.js";

export class LetterSectionComponent {
  constructor({ onNextSection }) {
    this.onNextSection = onNextSection;
    this.isOpen = false;
  }

  render() {
    const section = document.createElement("section");
    section.id = "section-letter";
    section.className = "min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative z-10 animate-fadeIn";

    section.innerHTML = `
      <div class="max-w-xl w-full mx-auto text-center">
        <!-- Header -->
        <div class="mb-6">
          <span class="text-3xl inline-block mb-1 animate-float">💌</span>
          <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-gradient-rose">A Letter From Modak</h1>
          <p class="text-xs text-purple-200/80 mt-1">Tap the wax seal to open your handwritten letter</p>
        </div>

        <!-- 3D Physical-Looking Envelope -->
        <div class="envelope-wrapper relative max-w-md mx-auto mb-6">
          
          <!-- Closed Envelope Visual -->
          <div id="envelope-closed" class="glass-panel p-8 sm:p-10 border border-pink-400/50 shadow-2xl bg-gradient-to-br from-purple-950/90 via-pink-950/80 to-purple-900/90 rounded-3xl cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden group">
            
            <!-- Envelope Flap Geometry Decoration -->
            <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            
            <div class="flex flex-col items-center justify-center py-6">
              <!-- Wax Seal Button -->
              <div id="wax-seal-btn" class="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-700 via-red-600 to-rose-500 border-2 border-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.6)] flex items-center justify-center text-white font-serif font-bold text-lg mb-4 group-hover:scale-110 transition-transform animate-pulse-slow">
                ${ENVELOPE_LETTER.waxSealText}
              </div>

              <h3 class="text-2xl font-script text-pink-200 font-bold mb-1">
                ${ENVELOPE_LETTER.envelopeTitle}
              </h3>
              <p class="text-xs text-purple-200/70 font-mono">
                ${ENVELOPE_LETTER.date}
              </p>

              <div class="mt-6 inline-flex items-center gap-1.5 text-xs text-pink-300 bg-pink-500/20 px-4 py-1.5 rounded-full border border-pink-400/30">
                <span>✨</span>
                <span>Click seal to unseal letter</span>
              </div>
            </div>
          </div>

          <!-- Unfolded Open Letter Container (Hidden until opened) -->
          <div id="letter-content-opened" class="hidden glass-panel p-6 sm:p-8 border border-pink-400/40 shadow-2xl bg-gradient-to-b from-[#22132e] via-[#1a0f24] to-[#12081a] rounded-3xl text-left relative overflow-hidden">
            
            <!-- Soft Vintage Paper Glow Aura -->
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <!-- Letter Header -->
            <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span class="text-xs font-mono text-purple-300/80 uppercase">From Darshan to Chanchal</span>
              <span class="text-xs text-pink-300 font-script text-base">My Safest Place ❤️</span>
            </div>

            <!-- Salutation -->
            <h3 class="text-xl sm:text-2xl font-script text-pink-200 font-bold mb-3">
              ${ENVELOPE_LETTER.salutation}
            </h3>

            <!-- Letter Paragraphs -->
            <div class="space-y-3 font-handwritten text-base sm:text-lg text-purple-100/95 leading-relaxed font-semibold">
              ${ENVELOPE_LETTER.paragraphs.map(p => `
                <p class="tracking-wide">${p}</p>
              `).join("")}
            </div>

            <!-- Sign Off -->
            <div class="mt-6 pt-4 border-t border-white/10 flex flex-col items-end">
              <span class="text-sm font-handwritten text-purple-300">${ENVELOPE_LETTER.signOff}</span>
              <span class="text-2xl font-script text-pink-200 font-bold">${ENVELOPE_LETTER.signature}</span>
            </div>

            <!-- Hidden P.S. Reveal Box -->
            <div id="letter-ps-box" class="mt-6 p-3 rounded-xl bg-pink-500/15 border border-pink-400/30 text-center animate-fadeIn">
              <p class="text-sm font-handwritten text-pink-200 font-bold italic">
                ${ENVELOPE_LETTER.ps}
              </p>
            </div>
          </div>

        </div>

        <!-- Continue Button -->
        <div id="letter-continue-wrapper" class="hidden flex items-center justify-center gap-3">
          <button id="letter-continue-btn" class="btn-romantic text-xs sm:text-sm py-3 px-8 shadow-xl">
            <span>Visit Kiss Corner</span>
            <span>💋</span>
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      const closedEnvelope = document.getElementById("envelope-closed");
      const waxSeal = document.getElementById("wax-seal-btn");
      const openedLetter = document.getElementById("letter-content-opened");
      const continueWrapper = document.getElementById("letter-continue-wrapper");
      const contBtn = document.getElementById("letter-continue-btn");

      const handleOpen = (e) => {
        if (this.isOpen) return;
        this.isOpen = true;

        audioManager.playRomanticTone(523.25, 0.8, "sine", 0.12);
        audioManager.playSparkle();
        spawnHeartBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 20, ["💌", "❤️", "💖", "🌸", "✨"]);

        closedEnvelope.classList.add("scale-95", "opacity-0");
        setTimeout(() => {
          closedEnvelope.classList.add("hidden");
          openedLetter.classList.remove("hidden");
          openedLetter.classList.add("animate-fadeIn");
          continueWrapper.classList.remove("hidden");
          triggerCelebrationConfetti();
        }, 300);
      };

      if (closedEnvelope) closedEnvelope.addEventListener("click", handleOpen);
      if (waxSeal) waxSeal.addEventListener("click", handleOpen);

      if (contBtn) {
        contBtn.addEventListener("click", (e) => {
          audioManager.playKissSound();
          if (this.onNextSection) {
            this.onNextSection("kiss");
          }
        });
      }
    }, 50);

    return section;
  }
}
