import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst, triggerCelebrationConfetti } from "../utils/particles.js";

export class KissSectionComponent {
  constructor({ initialKissCount = 0, onKissAdded, onNextSection, onUnlockAchievement }) {
    this.kissCount = initialKissCount;
    this.onKissAdded = onKissAdded;
    this.onNextSection = onNextSection;
    this.onUnlockAchievement = onUnlockAchievement;
  }

  getReaction(count) {
    if (count === 0) return "Send Modak a sweet kiss…";
    if (count === 1) return "Aww… 💋";
    if (count === 2) return "Okay, Coco… 🥰";
    if (count >= 3 && count < 5) return "Why am I smiling this much? 🤭❤️";
    if (count >= 5 && count < 10) return "This is becoming dangerously cute. 🙈✨";
    if (count >= 10 && count < 20) return "Congratulations. You have completely distracted your husband. 😌❤️";
    if (count >= 20 && count < 30) return "Okay. Fine. I surrender. You win. ❤️🔥";
    return "Achievement unlocked: You stole Modak's entire heart forever. 💍👑";
  }

  render() {
    const section = document.createElement("section");
    section.id = "section-kiss";
    section.className = "min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative z-10 animate-fadeIn";

    section.innerHTML = `
      <div class="max-w-xl w-full mx-auto text-center">
        <!-- Flirty Header -->
        <div class="mb-4">
          <span class="text-3xl inline-block mb-1 animate-float">💋</span>
          <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-gradient-rose">Kiss Corner</h1>
          <p class="text-xs font-serif italic text-purple-200/80 mt-1">“Excuse me, Bayko… I think I'm missing something.”</p>
        </div>

        <!-- Kiss Interactive Board -->
        <div class="glass-panel p-6 sm:p-8 mb-6 border border-pink-400/30 shadow-2xl relative overflow-hidden">
          
          <!-- Lipstick Print Canvas / Visual Area (3 Sept 2026 Memory Tribute) -->
          <div id="lipstick-canvas-area" class="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto mb-4 rounded-full bg-gradient-to-tr from-pink-900/30 via-rose-900/20 to-purple-900/30 border border-pink-400/40 flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:scale-105 transition-transform group">
            
            <div class="absolute inset-0 rounded-full bg-pink-500/10 blur-md group-hover:bg-pink-500/20 transition-all"></div>
            
            <!-- Lipstick Print Visual Stamp -->
            <div id="lipstick-stamp" class="relative z-10 text-6xl sm:text-7xl select-none transition-transform duration-200 active:scale-90 animate-pulse-slow">
              💋
            </div>

            <!-- Floating tiny counter badge on kiss target -->
            <div class="absolute bottom-2 px-3 py-0.5 rounded-full bg-pink-600/80 text-white text-[11px] font-bold shadow-md">
              <span id="kiss-count-badge">${this.kissCount}</span> Kisses
            </div>
          </div>

          <!-- Progressive Loving Reaction Display -->
          <div class="min-h-[52px] flex items-center justify-center">
            <h3 id="kiss-reaction-text" class="text-base sm:text-lg font-heading font-bold text-pink-200 transition-all duration-300">
              ${this.getReaction(this.kissCount)}
            </h3>
          </div>

          <!-- Lipstick Print Date Memory Note -->
          <div class="mt-3 p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-purple-200/80 flex items-center justify-center gap-1.5">
            <span>💄</span>
            <span>Tribute to 03 • 09 • 2026 — Evidence of Your First Lipstick Kiss</span>
          </div>

          <!-- Big Kiss Button -->
          <div class="mt-6 flex flex-col items-center gap-3">
            <button id="send-kiss-btn" class="btn-romantic text-sm sm:text-base py-3.5 px-8 shadow-[0_0_25px_rgba(244,63,94,0.6)] cursor-pointer active:scale-95">
              <span>Send a Kiss 💋</span>
            </button>
          </div>
        </div>

        <!-- Continue Button -->
        <div class="flex items-center justify-center gap-3">
          <button id="kiss-continue-btn" class="btn-secondary-romantic text-xs sm:text-sm py-3 px-8">
            <span>Explore Reasons I Love You</span>
            <span>♾️</span>
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      const sendKissBtn = document.getElementById("send-kiss-btn");
      const lipstickArea = document.getElementById("lipstick-canvas-area");
      const lipstickStamp = document.getElementById("lipstick-stamp");
      const countBadge = document.getElementById("kiss-count-badge");
      const reactionText = document.getElementById("kiss-reaction-text");
      const continueBtn = document.getElementById("kiss-continue-btn");

      const handleKiss = (e) => {
        this.kissCount++;
        audioManager.playKissSound();
        spawnHeartBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 12, ["💋", "❤️", "💖", "💄", "✨"]);

        // Animation on stamp
        if (lipstickStamp) {
          lipstickStamp.style.transform = "scale(1.4) rotate(-15deg)";
          setTimeout(() => {
            lipstickStamp.style.transform = "scale(1) rotate(0deg)";
          }, 180);
        }

        if (countBadge) countBadge.innerText = this.kissCount;

        if (reactionText) {
          reactionText.style.opacity = "0";
          setTimeout(() => {
            reactionText.innerText = this.getReaction(this.kissCount);
            reactionText.style.opacity = "1";
          }, 100);
        }

        if (this.onKissAdded) {
          this.onKissAdded(this.kissCount);
        }

        // Achievements check
        if (this.kissCount >= 10 && this.onUnlockAchievement) {
          this.onUnlockAchievement("kiss-attack");
        }
        if (this.kissCount >= 30) {
          triggerCelebrationConfetti();
        }
      };

      if (sendKissBtn) sendKissBtn.addEventListener("click", handleKiss);
      if (lipstickArea) lipstickArea.addEventListener("click", handleKiss);

      if (continueBtn) {
        continueBtn.addEventListener("click", () => {
          audioManager.playRomanticTone(523.25, 0.4);
          if (this.onNextSection) {
            this.onNextSection("compliments");
          }
        });
      }
    }, 50);

    return section;
  }
}
