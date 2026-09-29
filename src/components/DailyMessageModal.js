import { DAILY_LOVE_MESSAGES } from "../data/easterEggs.js";
import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst } from "../utils/particles.js";

export class DailyMessageModalComponent {
  constructor(onClose) {
    this.onClose = onClose;
    this.messageIndex = Math.floor(Math.random() * DAILY_LOVE_MESSAGES.length);
  }

  render() {
    const modal = document.createElement("div");
    modal.id = "daily-note-modal";
    modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn";

    const currentMsg = DAILY_LOVE_MESSAGES[this.messageIndex];

    modal.innerHTML = `
      <div class="glass-panel w-full max-w-sm p-6 relative border border-pink-400/40 shadow-2xl text-center bg-gradient-to-b from-purple-950/80 to-pink-950/80">
        <!-- Close button -->
        <button id="daily-close-btn" class="absolute top-4 right-4 text-purple-300 hover:text-white text-lg w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer">✕</button>

        <div class="w-14 h-14 mx-auto rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-3xl mb-3 animate-pulse-slow">
          💌
        </div>

        <h3 class="text-xs uppercase tracking-widest text-pink-300 font-bold">A Little Message From Modak</h3>
        <h4 class="text-lg font-script text-pink-200 mt-1">For My Princess Coco ❤️</h4>

        <div class="my-6 p-4 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
          <div class="absolute -top-3 -left-2 text-3xl text-pink-400/20 font-serif select-none">“</div>
          <p id="daily-message-text" class="text-sm md:text-base font-handwritten text-pink-100 leading-relaxed font-semibold italic">
            ${currentMsg}
          </p>
          <div class="absolute -bottom-4 -right-2 text-3xl text-pink-400/20 font-serif select-none">”</div>
        </div>

        <div class="flex items-center justify-center gap-2 mb-4">
          <button id="daily-next-note-btn" class="text-xs text-purple-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-1 transition-all cursor-pointer">
            <span>✨</span> Next Sweet Note
          </button>
        </div>

        <button id="daily-done-btn" class="btn-romantic w-full text-xs">
          I Love You Too, Modak ❤️
        </button>
      </div>
    `;

    setTimeout(() => {
      const close = () => {
        modal.classList.add("opacity-0");
        setTimeout(() => modal.remove(), 200);
        if (this.onClose) this.onClose();
      };

      const closeBtn = document.getElementById("daily-close-btn");
      const doneBtn = document.getElementById("daily-done-btn");
      const nextBtn = document.getElementById("daily-next-note-btn");
      const textEl = document.getElementById("daily-message-text");

      if (closeBtn) closeBtn.addEventListener("click", close);
      if (doneBtn) {
        doneBtn.addEventListener("click", (e) => {
          audioManager.playKissSound();
          spawnHeartBurst(e.clientX, e.clientY, 12, ["💋", "❤️", "🥰", "✨"]);
          close();
        });
      }

      if (nextBtn && textEl) {
        nextBtn.addEventListener("click", (e) => {
          audioManager.playSparkle();
          this.messageIndex = (this.messageIndex + 1) % DAILY_LOVE_MESSAGES.length;
          textEl.style.opacity = "0";
          setTimeout(() => {
            textEl.innerText = DAILY_LOVE_MESSAGES[this.messageIndex];
            textEl.style.opacity = "1";
          }, 150);
          spawnHeartBurst(e.clientX, e.clientY, 6, ["💌", "✨", "🌸"]);
        });
      }
    }, 50);

    return modal;
  }
}
