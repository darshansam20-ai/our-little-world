import { REAL_REASONS, INFINITE_REASONS, CUTE_QUIRKS } from "../data/compliments.js";
import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst } from "../utils/particles.js";

export class ComplimentsSectionComponent {
  constructor({ onOpenModakJoke, onNextSection }) {
    this.onOpenModakJoke = onOpenModakJoke;
    this.onNextSection = onNextSection;
    this.infiniteIndex = 0;
    this.clickCount = 0;
    this.typingTimer = null;
    this.fadeTimer = null;
  }

  stopAnimation() {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
    if (this.fadeTimer) {
      clearTimeout(this.fadeTimer);
      this.fadeTimer = null;
    }
  }

  typeReason(displayEl, fullText) {
    // 1. Cancel previous animations/timers
    this.stopAnimation();

    if (!displayEl) return;

    // 2. Remove/clear previous reason completely
    displayEl.textContent = "";
    displayEl.style.opacity = "1";

    let charIndex = 0;
    const totalChars = fullText.length;

    // 3. Render ONLY the new reason character by character smoothly
    const typeNextChar = () => {
      if (charIndex < totalChars) {
        charIndex++;
        displayEl.textContent = fullText.slice(0, charIndex);
        this.typingTimer = setTimeout(typeNextChar, 18);
      } else {
        this.typingTimer = null;
      }
    };

    typeNextChar();
  }

  render() {
    // Clean up any lingering timers on re-render
    this.stopAnimation();

    const section = document.createElement("section");
    section.id = "section-compliments";
    section.className = "min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative z-10 animate-fadeIn";

    section.innerHTML = `
      <div class="max-w-xl w-full mx-auto text-center">
        <!-- Header -->
        <div class="mb-5">
          <span class="text-3xl inline-block mb-1 animate-float">♾️</span>
          <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-gradient-lavender">Why I Love You</h1>
          <p class="text-xs text-purple-200/80 mt-1">Every little habit, every sweet smile, every ordinary moment</p>
        </div>

        <!-- Infinite Reason Generator Card (Big Infinity Symbol) -->
        <div class="glass-panel p-6 sm:p-8 mb-6 border border-purple-400/40 shadow-2xl relative overflow-hidden bg-gradient-to-b from-purple-950/70 to-pink-950/70">
          
          <div class="flex items-center justify-center mb-2">
            <span class="text-5xl sm:text-6xl font-extrabold text-gradient-rose animate-pulse-slow">
              ∞
            </span>
          </div>

          <h3 class="text-xs uppercase tracking-widest text-pink-300 font-bold mb-4">
            Want To Know Why I Love You?
          </h3>

          <!-- Active Reason Display Box -->
          <div class="min-h-[110px] sm:min-h-[120px] p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 w-full overflow-hidden text-center">
            <p id="infinite-reason-display" class="w-full text-center text-base sm:text-lg md:text-xl font-handwritten text-purple-100 font-bold leading-relaxed tracking-wide select-none break-words whitespace-normal">
              “${REAL_REASONS[0]}”
            </p>
          </div>

          <!-- Progressive Generator Status Subtitle -->
          <div id="infinite-status-tag" class="text-[11px] text-pink-300/80 font-medium mb-4 min-h-[1rem] flex items-center justify-center"></div>

          <!-- Action Button: Give Me A Reason -->
          <button id="infinite-generate-btn" class="btn-romantic text-xs sm:text-sm py-3 px-6 shadow-[0_0_20px_rgba(236,72,153,0.5)] cursor-pointer">
            <span>Give me another reason ❤️</span>
          </button>
        </div>

        <!-- Cute Quirks & Inside Jokes Grid -->
        <div class="glass-panel-subtle p-4 sm:p-5 rounded-2xl mb-6 border border-white/10 text-left">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-pink-300 uppercase tracking-wider">Cute Habits & Inside Jokes</span>
            <span class="text-xs text-purple-300/70 font-script text-base">Pure Cutest Princess</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <!-- Modak Eating Joke Button -->
            <div id="quirk-eat-modak-btn" class="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 hover:bg-amber-500/20 transition-all cursor-pointer group">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xl group-hover:scale-125 transition-transform">🥟</span>
                <h4 class="text-xs font-bold text-amber-200">Eating Modak</h4>
              </div>
              <p class="text-[11px] text-amber-100/70">Warning: Coco may attempt to bite Modak at any time.</p>
            </div>

            <!-- Scolding Habit -->
            <div class="p-3 rounded-xl bg-purple-500/10 border border-purple-400/30">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xl">😤</span>
                <h4 class="text-xs font-bold text-pink-200">The Angry Scolding</h4>
              </div>
              <p class="text-[11px] text-purple-200/70">“Even when you're scolding me, you're secretly adorable.”</p>
            </div>
          </div>
        </div>

        <!-- Continue Button -->
        <div class="flex items-center justify-center gap-3">
          <button id="compliments-continue-btn" class="btn-secondary-romantic text-xs sm:text-sm py-3 px-8">
            <span>Play Love Quiz</span>
            <span>🥰</span>
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      const genBtn = document.getElementById("infinite-generate-btn");
      const display = document.getElementById("infinite-reason-display");
      const statusTag = document.getElementById("infinite-status-tag");
      const modakQuirk = document.getElementById("quirk-eat-modak-btn");
      const contBtn = document.getElementById("compliments-continue-btn");

      if (genBtn && display) {
        genBtn.addEventListener("click", (e) => {
          this.clickCount++;
          this.infiniteIndex = (this.infiniteIndex + 1) % INFINITE_REASONS.length;
          
          audioManager.playRomanticTone(440 + (this.clickCount % 8) * 30, 0.4);
          spawnHeartBurst(e.clientX, e.clientY, 8, ["❤️", "♾️", "💖", "✨"]);

          const nextReason = `“${INFINITE_REASONS[this.infiniteIndex]}”`;
          this.typeReason(display, nextReason);

          if (statusTag) {
            if (this.clickCount === 5) statusTag.innerText = "Still asking? 🥰";
            else if (this.clickCount === 10) statusTag.innerText = "I can keep giving you reasons forever… ❤️";
            else if (this.clickCount >= 15) statusTag.innerText = "Because loving you doesn't run out of reasons. ✨";
          }
        });
      }

      if (modakQuirk && this.onOpenModakJoke) {
        modakQuirk.addEventListener("click", () => {
          audioManager.playSparkle();
          this.onOpenModakJoke();
        });
      }

      if (contBtn) {
        contBtn.addEventListener("click", () => {
          audioManager.playRomanticTone(523.25, 0.4);
          if (this.onNextSection) {
            this.onNextSection("quiz");
          }
        });
      }
    }, 50);

    return section;
  }
}

