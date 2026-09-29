import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst, triggerCelebrationConfetti } from "../utils/particles.js";

const HEART_PHRASES = [
  "Coco 💖",
  "Bayko ❤️",
  "My Princess 👑",
  "My Favorite Person ✨",
  "My Safe Place 🏡",
  "My Happiness 🥰",
  "My Humsafar 🕊️",
  "My Home 🌸",
  "My Heart 💓",
  "My Forever 💍",
];

export class HeartGameSectionComponent {
  constructor({ highScore = 0, onScoreUpdate, onNextSection, onUnlockAchievement }) {
    this.highScore = highScore;
    this.onScoreUpdate = onScoreUpdate;
    this.onNextSection = onNextSection;
    this.onUnlockAchievement = onUnlockAchievement;
    this.score = 0;
    this.targetScore = 10;
    this.isPlaying = false;
    this.animationFrame = null;
    this.fallingHearts = [];
    this.spawnTimer = null;
  }

  render() {
    const section = document.createElement("section");
    section.id = "section-heart-game";
    section.className = "min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative z-10 animate-fadeIn";

    section.innerHTML = `
      <div class="max-w-xl w-full mx-auto text-center">
        <!-- Header -->
        <div class="mb-4">
          <span class="text-3xl inline-block mb-1 animate-float">🎯</span>
          <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-gradient-rose">Catch My Heart</h1>
          <p class="text-xs text-purple-200/80 mt-1">Tap the falling pieces of Modak's heart to catch them</p>
        </div>

        <!-- Game Screen Canvas Container -->
        <div class="glass-panel p-4 sm:p-6 mb-6 border border-pink-400/30 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#180d24] to-[#100818]">
          
          <!-- Score Bar HUD -->
          <div class="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="text-pink-300 font-bold">Hearts Caught:</span>
              <span id="game-score-val" class="font-mono font-bold text-pink-200 text-sm">0 / ${this.targetScore}</span>
            </div>
            <span class="text-purple-300/70 font-script text-base">Catch Every Piece</span>
          </div>

          <!-- Play Area Screen -->
          <div id="game-play-area" class="relative w-full h-80 sm:h-96 rounded-2xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center">
            
            <!-- Start Screen Overlay -->
            <div id="game-start-overlay" class="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/70 backdrop-blur-xs">
              <span class="text-5xl mb-3 animate-heartbeat">❤️</span>
              <h3 class="text-lg font-bold text-pink-200 mb-1">Ready to catch my love?</h3>
              <p class="text-xs text-purple-200/80 mb-5 max-w-xs">Each falling heart carries a sweet name I have for you.</p>
              <button id="game-start-btn" class="btn-romantic text-xs sm:text-sm py-3 px-8 shadow-xl cursor-pointer">
                Start Catching ❤️
              </button>
            </div>

            <!-- Victory Screen Overlay -->
            <div id="game-victory-overlay" class="hidden absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-purple-950/90 backdrop-blur-md animate-fadeIn">
              <span class="text-5xl mb-2">👑 ❤️ 💍</span>
              <h2 class="text-xl sm:text-2xl font-heading font-extrabold text-gradient-rose">
                YOU CAUGHT THE WHOLE HEART ❤️
              </h2>
              <p class="text-xs text-pink-200/90 font-serif italic mt-2 mb-4">
                “Although… it was yours already.”
              </p>
              <button id="game-proceed-btn" class="btn-romantic text-xs sm:text-sm py-3 px-8 shadow-xl">
                <span>Open Your Surprise Box</span>
                <span>🎁</span>
              </button>
            </div>

          </div>

        </div>

        <!-- Continue Button -->
        <div class="flex items-center justify-center gap-3">
          <button id="heart-game-skip-btn" class="btn-secondary-romantic text-xs py-2.5 px-6">
            <span>Skip to Surprise Box</span>
            <span>🎁</span>
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      const playArea = document.getElementById("game-play-area");
      const startOverlay = document.getElementById("game-start-overlay");
      const startBtn = document.getElementById("game-start-btn");
      const victoryOverlay = document.getElementById("game-victory-overlay");
      const proceedBtn = document.getElementById("game-proceed-btn");
      const scoreVal = document.getElementById("game-score-val");
      const skipBtn = document.getElementById("heart-game-skip-btn");

      const spawnFallingHeart = () => {
        if (!this.isPlaying || !playArea) return;

        const phrase = HEART_PHRASES[Math.floor(Math.random() * HEART_PHRASES.length)];
        const heartEl = document.createElement("div");
        heartEl.className = "absolute z-10 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-600/80 to-purple-600/80 border border-pink-300/60 shadow-[0_0_15px_rgba(244,63,94,0.5)] text-white text-xs font-bold cursor-pointer select-none transition-transform hover:scale-125";
        heartEl.innerText = phrase;

        const areaWidth = playArea.clientWidth - 120;
        const startX = Math.random() * Math.max(20, areaWidth) + 10;
        heartEl.style.left = `${startX}px`;
        heartEl.style.top = `-40px`;

        playArea.appendChild(heartEl);

        let posY = -40;
        const speed = Math.random() * 1.5 + 1.2;

        const fallInterval = setInterval(() => {
          if (!this.isPlaying) {
            clearInterval(fallInterval);
            if (heartEl.parentNode) heartEl.remove();
            return;
          }

          posY += speed;
          heartEl.style.top = `${posY}px`;

          if (posY > playArea.clientHeight + 20) {
            clearInterval(fallInterval);
            if (heartEl.parentNode) heartEl.remove();
          }
        }, 16);

        // Tap on heart to catch
        heartEl.addEventListener("click", (e) => {
          e.stopPropagation();
          clearInterval(fallInterval);
          audioManager.playHeartCatch();
          spawnHeartBurst(e.clientX, e.clientY, 8, ["💖", "✨", "❤️"]);
          if (heartEl.parentNode) heartEl.remove();

          this.score++;
          if (scoreVal) scoreVal.innerText = `${this.score} / ${this.targetScore}`;

          if (this.score >= this.targetScore) {
            this.isPlaying = false;
            if (this.spawnTimer) clearInterval(this.spawnTimer);
            audioManager.playCelebrationChord();
            triggerCelebrationConfetti();
            if (this.onUnlockAchievement) {
              this.onUnlockAchievement("heart-thief");
            }
            if (victoryOverlay) victoryOverlay.classList.remove("hidden");
          }
        });
      };

      const startGame = () => {
        this.isPlaying = true;
        this.score = 0;
        if (scoreVal) scoreVal.innerText = `0 / ${this.targetScore}`;
        if (startOverlay) startOverlay.classList.add("hidden");
        if (victoryOverlay) victoryOverlay.classList.add("hidden");

        audioManager.playRomanticTone(523.25, 0.4);

        if (this.spawnTimer) clearInterval(this.spawnTimer);
        this.spawnTimer = setInterval(spawnFallingHeart, 900);
        spawnFallingHeart();
      };

      if (startBtn) startBtn.addEventListener("click", startGame);

      const goToSurprise = () => {
        this.isPlaying = false;
        if (this.spawnTimer) clearInterval(this.spawnTimer);
        audioManager.playRomanticTone(523.25, 0.4);
        if (this.onNextSection) {
          this.onNextSection("surprise");
        }
      };

      if (proceedBtn) proceedBtn.addEventListener("click", goToSurprise);
      if (skipBtn) skipBtn.addEventListener("click", goToSurprise);
    }, 50);

    return section;
  }
}
