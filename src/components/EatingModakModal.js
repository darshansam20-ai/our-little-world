import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst } from "../utils/particles.js";

export class EatingModakModalComponent {
  constructor(onClose) {
    this.onClose = onClose;
  }

  render() {
    const modal = document.createElement("div");
    modal.id = "eating-modak-modal";
    modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn";

    modal.innerHTML = `
      <div class="glass-panel w-full max-w-sm p-6 relative border border-amber-400/50 shadow-2xl text-center bg-gradient-to-b from-amber-950/70 to-purple-950/80">
        <!-- Close button -->
        <button id="modak-joke-close-btn" class="absolute top-4 right-4 text-purple-300 hover:text-white text-lg w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer">✕</button>

        <div class="text-4xl mb-2 animate-bounce">
          🥟⚠️😋
        </div>

        <h3 class="text-sm uppercase tracking-wider text-amber-300 font-bold">Secret Couple Report</h3>
        <h4 class="text-xl font-heading font-bold text-pink-200 mt-1">Coco's Favorite Hobby: Eating Modak 😂</h4>

        <div class="my-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-left space-y-2.5 text-xs text-amber-100">
          <div class="flex items-start gap-2">
            <span class="text-amber-400 font-bold">⚠️ Warning:</span>
            <span>Coco may attempt to eat / bite Modak at any given moment.</span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-pink-400 font-bold">❓ Reason:</span>
            <span>Unknown. Modak is apparently 100% edible and too cute to resist.</span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-emerald-400 font-bold">✅ Conclusion:</span>
            <span>Extremely cute. Modak happily surrenders as your permanent snack. ❤️</span>
          </div>
        </div>

        <button id="modak-joke-confirm-btn" class="btn-romantic w-full text-xs">
          Take Another Bite of Modak 🥟❤️
        </button>
      </div>
    `;

    setTimeout(() => {
      const close = () => {
        modal.classList.add("opacity-0");
        setTimeout(() => modal.remove(), 200);
        if (this.onClose) this.onClose();
      };

      const closeBtn = document.getElementById("modak-joke-close-btn");
      const confirmBtn = document.getElementById("modak-joke-confirm-btn");
      if (closeBtn) closeBtn.addEventListener("click", close);
      if (confirmBtn) {
        confirmBtn.addEventListener("click", (e) => {
          audioManager.playKissSound();
          spawnHeartBurst(e.clientX, e.clientY, 15, ["🥟", "😋", "❤️", "💋", "✨"]);
          close();
        });
      }
    }, 50);

    return modal;
  }
}
