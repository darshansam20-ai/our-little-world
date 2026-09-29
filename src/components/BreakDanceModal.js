import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst } from "../utils/particles.js";
import { FUNNY_MEMORY } from "../data/memories.js";

export class BreakDanceModalComponent {
  constructor(onClose) {
    this.onClose = onClose;
  }

  render() {
    const modal = document.createElement("div");
    modal.id = "breakdance-modal";
    modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn";

    modal.innerHTML = `
      <div class="glass-panel w-full max-w-sm p-6 relative border border-purple-400/50 shadow-2xl text-center bg-gradient-to-b from-purple-950/80 to-pink-950/80">
        <!-- Close button -->
        <button id="breakdance-close-btn" class="absolute top-4 right-4 text-purple-300 hover:text-white text-lg w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer">✕</button>

        <div class="text-4xl mb-2 animate-bounce">
          🎢🛡️😂
        </div>

        <h3 class="text-xs uppercase tracking-widest text-purple-300 font-bold">Unforgettable Mela Memory</h3>
        <h4 class="text-lg font-heading font-bold text-pink-200 mt-1">${FUNNY_MEMORY.title}</h4>

        <div class="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-3">
          <p class="text-xs text-purple-100 leading-relaxed">
            ${FUNNY_MEMORY.story}
          </p>
          <div class="p-3 rounded-xl bg-purple-500/20 border border-purple-400/30">
            <p class="text-xs font-handwritten text-pink-200 italic font-semibold text-center">
              ${FUNNY_MEMORY.quote}
            </p>
          </div>
        </div>

        <button id="breakdance-confirm-btn" class="btn-romantic w-full text-xs">
          Best Husband Protection Ever 🛡️❤️
        </button>
      </div>
    `;

    setTimeout(() => {
      const close = () => {
        modal.classList.add("opacity-0");
        setTimeout(() => modal.remove(), 200);
        if (this.onClose) this.onClose();
      };

      const closeBtn = document.getElementById("breakdance-close-btn");
      const confirmBtn = document.getElementById("breakdance-confirm-btn");
      if (closeBtn) closeBtn.addEventListener("click", close);
      if (confirmBtn) {
        confirmBtn.addEventListener("click", (e) => {
          audioManager.playSparkle();
          spawnHeartBurst(e.clientX, e.clientY, 10, ["🎢", "😂", "❤️", "🥰"]);
          close();
        });
      }
    }, 50);

    return modal;
  }
}
