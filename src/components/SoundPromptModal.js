import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst } from "../utils/particles.js";
import { SONGS } from "../data/songs.js";

export class SoundPromptModalComponent {
  constructor(onChoice) {
    this.onChoice = onChoice;
  }

  render() {
    const modal = document.createElement("div");
    modal.id = "sound-prompt-modal";
    modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fadeIn";

    modal.innerHTML = `
      <div class="glass-panel w-full max-w-sm p-6 relative border border-pink-400/40 shadow-2xl text-center bg-gradient-to-b from-purple-950/90 to-pink-950/90">
        <div class="w-16 h-16 mx-auto rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-3xl mb-3 animate-pulse-glow">
          🎵
        </div>

        <h3 class="text-xs uppercase tracking-widest text-pink-300 font-bold">A Romantic Touch</h3>
        <h4 class="text-xl font-heading font-bold text-pink-100 mt-1">Our Little World</h4>
        <p class="text-xs text-purple-200/80 mt-2 leading-relaxed">
          “Would you like a little romantic music while exploring our world, my Bayko? 🎵❤️”
        </p>

        <div class="mt-6 space-y-2">
          <button id="sound-yes-btn" class="btn-romantic w-full text-xs py-3">
            Yes, play our melodies 🎶✨
          </button>
          <button id="sound-no-btn" class="btn-secondary-romantic w-full text-xs py-2.5">
            Explore in quiet for now
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      const finish = (enableMusic) => {
        if (enableMusic) {
          audioManager.isMuted = false;
          // Start with special song "I Wanna Be Yours"
          audioManager.playSong(SONGS[0]);
        } else {
          audioManager.isMuted = true;
          audioManager.pauseMusic();
        }
        modal.classList.add("opacity-0");
        setTimeout(() => modal.remove(), 250);
        if (this.onChoice) this.onChoice(enableMusic);
      };

      const yesBtn = document.getElementById("sound-yes-btn");
      const noBtn = document.getElementById("sound-no-btn");

      if (yesBtn) {
        yesBtn.addEventListener("click", (e) => {
          spawnHeartBurst(e.clientX, e.clientY, 15, ["🎵", "❤️", "✨", "🎶"]);
          finish(true);
        });
      }
      if (noBtn) {
        noBtn.addEventListener("click", () => {
          finish(false);
        });
      }
    }, 50);

    return modal;
  }
}
