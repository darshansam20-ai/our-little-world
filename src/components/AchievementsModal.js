import { ACHIEVEMENTS } from "../data/easterEggs.js";
import { audioManager } from "../utils/audioManager.js";
import { triggerCelebrationConfetti } from "../utils/particles.js";

export class AchievementsModalComponent {
  constructor(unlockedIds = [], onClose) {
    this.unlockedIds = unlockedIds;
    this.onClose = onClose;
  }

  render() {
    const modal = document.createElement("div");
    modal.id = "achievements-modal-overlay";
    modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn";

    const total = ACHIEVEMENTS.length;
    const unlockedCount = this.unlockedIds.length;
    const isAllUnlocked = unlockedCount >= total;

    modal.innerHTML = `
      <div class="glass-panel w-full max-w-md p-6 relative border border-purple-400/40 shadow-2xl max-h-[90vh] overflow-y-auto">
        <!-- Close button -->
        <button id="achievements-close-btn" class="absolute top-4 right-4 text-purple-300 hover:text-white text-lg w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer">✕</button>

        <div class="text-center mb-6">
          <span class="text-3xl inline-block mb-1">🏆</span>
          <h2 class="text-xl font-heading font-bold text-gradient-rose">Our Love Milestones</h2>
          <p class="text-xs text-purple-200/80 mt-1">Special badges unlocked on our journey together</p>
          
          <div class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs font-semibold text-pink-300">
            <span>Progress: ${unlockedCount} / ${total} Unlocked</span>
            <div class="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-pink-500 to-purple-500" style="width: ${(unlockedCount / total) * 100}%"></div>
            </div>
          </div>
        </div>

        <div class="space-y-2.5">
          ${ACHIEVEMENTS.map(ach => {
            const isUnlocked = this.unlockedIds.includes(ach.id);
            return `
              <div class="p-3 rounded-xl border transition-all ${isUnlocked ? 'bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-purple-900/40 border-pink-400/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'bg-white/5 border-white/10 opacity-50'} flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${isUnlocked ? 'bg-pink-500/30 border border-pink-400/50 text-pink-200' : 'bg-white/5 text-gray-500'}">
                  ${isUnlocked ? (ach.title.split(' ')[0]) : '🔒'}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-1">
                    <h4 class="text-xs font-bold ${isUnlocked ? 'text-pink-200' : 'text-gray-400'}">${ach.title}</h4>
                    <span class="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${isUnlocked ? 'bg-pink-500/20 text-pink-300' : 'bg-white/5 text-gray-400'}">
                      ${isUnlocked ? 'Unlocked ✨' : 'Locked'}
                    </span>
                  </div>
                  <p class="text-[11px] text-purple-200/70 mt-0.5">${ach.description}</p>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        ${isAllUnlocked ? `
          <div class="mt-6 p-4 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/40 text-center">
            <span class="text-2xl">💍</span>
            <h4 class="text-sm font-bold text-pink-200 mt-1">Every Piece Of My Heart Is Yours</h4>
            <p class="text-xs text-purple-200/80 mt-1">“You have unlocked all my love, my Bayko.”</p>
          </div>
        ` : ''}

        <div class="mt-6 text-center">
          <button id="achievements-dismiss-btn" class="btn-romantic w-full text-xs">
            Continue Our Story ❤️
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      const close = () => {
        modal.classList.add("opacity-0");
        setTimeout(() => modal.remove(), 200);
        if (this.onClose) this.onClose();
      };

      const closeBtn = document.getElementById("achievements-close-btn");
      const dismissBtn = document.getElementById("achievements-dismiss-btn");
      if (closeBtn) closeBtn.addEventListener("click", close);
      if (dismissBtn) dismissBtn.addEventListener("click", close);

      if (isAllUnlocked) {
        triggerCelebrationConfetti();
      }
    }, 50);

    return modal;
  }
}
