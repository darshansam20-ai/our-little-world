import { FLOWERS, BOUQUET_QUOTES } from "../data/flowers.js";
import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst, triggerCelebrationConfetti } from "../utils/particles.js";
import { EASTER_EGGS } from "../data/easterEggs.js";

// Florist Bouquet Composition Arrangement Definition
const BOUQUET_COMPOSITION = [
  // LAYER 1: Botanical Greenery & Stems
  { id: "leaf-l", layer: 1, type: "greenery", emoji: "🌿", x: -85, y: -50, rot: -38, size: 28, label: "Lush Greenery" },
  { id: "leaf-r", layer: 1, type: "greenery", emoji: "🌿", x: 85, y: -50, rot: 38, size: 28, label: "Lush Greenery" },
  { id: "leaf-top-l", layer: 1, type: "greenery", emoji: "🍃", x: -45, y: -98, rot: -20, size: 22, label: "Delicate Leaves" },
  { id: "leaf-top-r", layer: 1, type: "greenery", emoji: "🍃", x: 45, y: -98, rot: 20, size: 22, label: "Delicate Leaves" },

  // LAYER 2: Back Layer (Taller flowers, wide fan-out)
  { id: "lav-l", layer: 2, type: "flower", flowerId: "lavender", emoji: "🪻", x: -74, y: -75, rot: -26, size: 40, label: "Fragrant Lavender" },
  { id: "lav-r", layer: 2, type: "flower", flowerId: "lavender", emoji: "🪻", x: 74, y: -75, rot: 26, size: 40, label: "Fragrant Lavender" },
  { id: "sunflower-top", layer: 2, type: "flower", flowerId: "sunflower", emoji: "🌻", x: -38, y: -86, rot: -10, size: 44, label: "Golden Sunflower" },
  { id: "daisy-top", layer: 2, type: "flower", flowerId: "daisy", emoji: "🌼", x: 38, y: -86, rot: 12, size: 42, label: "White & Gold Daisy" },

  // LAYER 3: Middle Layer (Filling sides, crown, and accents)
  { id: "tulip-l", layer: 3, type: "flower", flowerId: "tulip", emoji: "🌷", x: -52, y: -48, rot: -18, size: 42, label: "Blush Tulip" },
  { id: "tulip-r", layer: 3, type: "flower", flowerId: "tulip", emoji: "🌷", x: 52, y: -48, rot: 18, size: 42, label: "Blush Tulip" },
  { id: "cherry-crown", layer: 3, type: "flower", flowerId: "cherry-blossom", emoji: "🌸", x: 0, y: -96, rot: 0, size: 42, label: "Cherry Blossom" },
  { id: "cherry-l", layer: 3, type: "flower", flowerId: "cherry-blossom", emoji: "🌸", x: -24, y: -62, rot: -8, size: 36, label: "Cherry Blossom" },
  { id: "daisy-r", layer: 3, type: "flower", flowerId: "daisy", emoji: "🌼", x: 24, y: -62, rot: 8, size: 36, label: "Golden Daisy" },

  // LAYER 4: Front Focal Layer (DARSHAN'S CHOSEN ROSES - Heart of the Bouquet)
  { id: "rose-center", layer: 4, type: "focal-rose", flowerId: "rose", emoji: "🌹", x: 0, y: -44, rot: 0, size: 54, isMainFocal: true, label: "Main Red Rose" },
  { id: "rose-left", layer: 4, type: "focal-rose", flowerId: "rose", emoji: "🌹", x: -28, y: -26, rot: -12, size: 44, isMainFocal: true, label: "Pink Rose" },
  { id: "rose-right", layer: 4, type: "focal-rose", flowerId: "rose", emoji: "🌹", x: 28, y: -26, rot: 12, size: 44, isMainFocal: true, label: "Pink Rose" },
];

export class BouquetSectionComponent {
  constructor({ isRevealed = false, onBouquetRevealed, onNextSection, onUnlockAchievement, onSecretTriggered }) {
    this.isRevealed = isRevealed;
    this.onBouquetRevealed = onBouquetRevealed;
    this.onNextSection = onNextSection;
    this.onUnlockAchievement = onUnlockAchievement;
    this.onSecretTriggered = onSecretTriggered;
    this.revealedItemIds = isRevealed ? BOUQUET_COMPOSITION.map(item => item.id) : [];
    this.flowerClickCounts = {};
    this.isBlooming = false;
  }

  render() {
    const section = document.createElement("section");
    section.id = "section-bouquet";
    section.className = "min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative z-10 animate-fadeIn";

    section.innerHTML = `
      <div class="max-w-xl w-full mx-auto text-center">
        
        <!-- Header: Before Receiving -->
        <div id="bouquet-header-intro" class="mb-5 ${this.isRevealed ? 'hidden' : ''}">
          <span class="text-4xl inline-block mb-2 animate-bounce">🌸</span>
          <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-gradient-rose">Wait, Bayko…</h1>
          <p class="text-sm font-serif italic text-purple-200/90 mt-1">“I have something for you.”</p>
        </div>

        <!-- Header: After Receiving -->
        <div id="bouquet-header-revealed" class="mb-5 ${this.isRevealed ? '' : 'hidden'} animate-fadeIn">
          <span class="text-3xl inline-block mb-1 animate-float">💐</span>
          <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-gradient-rose">${BOUQUET_QUOTES.header}</h1>
          <p class="text-xs text-purple-200/80 mt-1">A handcrafted florist bouquet lovingly arranged for his Princess Coco</p>
        </div>

        <!-- Interactive Bouquet Stage Card -->
        <div class="glass-panel p-6 sm:p-8 mb-6 border border-pink-400/40 relative overflow-hidden shadow-2xl bg-gradient-to-b from-purple-950/85 via-[#1a0c2a]/95 to-pink-950/85">
          
          <!-- Closed Bouquet Delivery Box State (Before Revealing) -->
          <div id="bouquet-closed-stage" class="${this.isRevealed ? 'hidden' : ''} flex flex-col items-center py-6">
            <div class="relative w-44 h-44 sm:w-52 sm:h-52 mb-5 flex items-center justify-center">
              <!-- Radiant Ambient Pulsing Aura -->
              <div class="absolute inset-0 rounded-full bg-pink-500/20 blur-2xl animate-pulseGlow"></div>
              
              <!-- Gift Bouquet Parcel Visual -->
              <div class="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-pink-700/60 via-purple-700/50 to-pink-500/60 border-2 border-pink-400/60 shadow-[0_0_30px_rgba(244,63,94,0.4)] flex flex-col items-center justify-center p-4 animate-float">
                <span class="text-5xl select-none mb-1">💐</span>
                <span class="text-xs font-bold text-pink-100 tracking-wider">For Bayko ❤️</span>
                <span class="text-[10px] text-pink-300/80 font-mono mt-0.5">From Modak</span>
              </div>
            </div>

            <p class="text-xs text-purple-200/80 font-serif italic mb-6">
              “Darshan is handing you a special bouquet…”
            </p>

            <button id="receive-bouquet-btn" class="btn-romantic text-sm sm:text-base py-3.5 px-8 shadow-[0_0_25px_rgba(244,63,94,0.6)] cursor-pointer hover:scale-105 active:scale-95 transition-all">
              <span>Receive Your Bouquet 💐</span>
            </button>
          </div>

          <!-- Open / Blooming Cohesive Bouquet Stage (After Revealing) -->
          <div id="bouquet-open-stage" class="${this.isRevealed ? '' : 'hidden'} animate-fadeIn">
            
            <!-- Florist Bouquet Visual Stage Container -->
            <div class="bouquet-stage-container animate-float mb-4">
              
              <!-- Background Ambient Glow Aura -->
              <div class="absolute inset-4 rounded-full bg-gradient-to-tr from-pink-500/25 via-purple-500/25 to-amber-500/20 blur-2xl animate-pulseSlow"></div>
              
              <!-- Stem Graphics (Converging into wrapper) -->
              <div class="absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-16 pointer-events-none z-10 opacity-70">
                <svg viewBox="0 0 100 80" class="w-full h-full stroke-emerald-700 fill-none stroke-[2.5] stroke-linecap-round">
                  <path d="M50 80 L30 10" />
                  <path d="M50 80 L40 5" />
                  <path d="M50 80 L50 0" />
                  <path d="M50 80 L60 5" />
                  <path d="M50 80 L70 10" />
                </svg>
              </div>

              <!-- Layered Floral Arrangement Elements Container -->
              <div id="bouquet-layered-flowers" class="relative w-full h-full flex items-center justify-center">
                ${this.renderComposedBouquet()}
              </div>

              <!-- Florist Cone Paper Wrapper -->
              <div class="bouquet-wrapper-paper flex flex-col items-center justify-end pb-3">
                <div class="px-2.5 py-0.5 rounded-full bg-pink-500/30 border border-pink-300/40 text-[9px] font-bold text-pink-100 uppercase tracking-wider shadow-sm">
                  For Coco ❤️
                </div>
              </div>

              <!-- Satin Ribbon & Bow -->
              <div class="bouquet-ribbon-bow flex flex-col items-center">
                <span class="text-3xl select-none animate-pulse-slow">🎀</span>
              </div>

            </div>

            <!-- Heartfelt Delivery Quotes & Personal Notes -->
            <div class="space-y-2 text-center pt-2">
              <p class="text-xs sm:text-sm text-purple-200/95 font-serif italic leading-relaxed">
                ${BOUQUET_QUOTES.subHeader}
              </p>
              <p class="text-sm sm:text-base font-handwritten text-pink-300 font-bold">
                ${BOUQUET_QUOTES.finalQuote}
              </p>
              
              <div class="mt-3 p-2.5 rounded-xl bg-pink-500/15 border border-pink-400/30 inline-block">
                <p class="text-xs font-handwritten text-pink-200 font-bold italic">
                  ${BOUQUET_QUOTES.personalizedNote}
                </p>
              </div>
            </div>

            <!-- Playful Thank You Interaction -->
            <div class="mt-5 flex flex-col items-center gap-2">
              <button id="bouquet-thank-you-btn" class="btn-secondary-romantic text-xs px-5 py-2 hover:bg-pink-500/20 transition-all cursor-pointer">
                <span>Thank You, Modak ❤️</span>
              </button>
              
              <div id="bouquet-modak-reply" class="hidden p-2 rounded-lg bg-purple-500/20 border border-purple-400/30 text-xs font-bold text-pink-200 animate-fadeIn">
                ${BOUQUET_QUOTES.playfulReply}
              </div>
            </div>

          </div>

        </div>

        <!-- Action / Continue Button -->
        <div id="bouquet-action-bar" class="${this.isRevealed ? '' : 'hidden'} flex items-center justify-center gap-3 animate-fadeIn">
          <button id="bouquet-continue-btn" class="btn-romantic text-xs sm:text-sm py-3.5 px-8 shadow-xl">
            <span>Read My Love Letter</span>
            <span>💌</span>
          </button>
        </div>

      </div>
    `;

    setTimeout(() => {
      const receiveBtn = document.getElementById("receive-bouquet-btn");
      const closedStage = document.getElementById("bouquet-closed-stage");
      const openStage = document.getElementById("bouquet-open-stage");
      const headerIntro = document.getElementById("bouquet-header-intro");
      const headerRevealed = document.getElementById("bouquet-header-revealed");
      const flowersContainer = document.getElementById("bouquet-layered-flowers");
      const actionBar = document.getElementById("bouquet-action-bar");
      const thankYouBtn = document.getElementById("bouquet-thank-you-btn");
      const modakReply = document.getElementById("bouquet-modak-reply");
      const continueBtn = document.getElementById("bouquet-continue-btn");

      // Handle the staged florist bouquet reveal
      const handleReceive = (e) => {
        if (this.isBlooming) return;
        this.isBlooming = true;

        audioManager.playRomanticTone(440, 0.5);
        audioManager.playBloom();
        spawnHeartBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 20, ["🌸", "🌹", "💐", "✨", "❤️"]);

        // Hide closed stage and show open stage
        closedStage.classList.add("hidden");
        headerIntro.classList.add("hidden");
        openStage.classList.remove("hidden");
        headerRevealed.classList.remove("hidden");

        // Staged bloom sequence:
        // Group items by layer
        this.revealedItemIds = [];
        flowersContainer.innerHTML = "";

        const layers = [1, 2, 3, 4];
        layers.forEach((layerNum, lIdx) => {
          setTimeout(() => {
            const layerItems = BOUQUET_COMPOSITION.filter(item => item.layer === layerNum);
            layerItems.forEach(item => {
              this.revealedItemIds.push(item.id);
            });

            flowersContainer.innerHTML = this.renderComposedBouquet();
            
            // Audio feedback per layer
            if (layerNum === 4) {
              // Focal roses layer
              audioManager.playCelebrationChord();
              audioManager.playBloom();
              spawnHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 16, ["🌹", "❤️", "💖", "✨"]);
            } else {
              audioManager.playRomanticTone(392 + layerNum * 55, 0.45, "sine", 0.09);
            }

            this.attachFlowerClickListeners();

            // Final completion
            if (lIdx === layers.length - 1) {
              setTimeout(() => {
                this.isBlooming = false;
                this.isRevealed = true;
                triggerCelebrationConfetti();
                if (actionBar) actionBar.classList.remove("hidden");

                if (this.onBouquetRevealed) {
                  this.onBouquetRevealed();
                }
                if (this.onUnlockAchievement) {
                  this.onUnlockAchievement("bouquet-builder");
                }
              }, 400);
            }
          }, (lIdx + 1) * 380);
        });
      };

      if (receiveBtn) {
        receiveBtn.addEventListener("click", handleReceive);
      }

      // Playful "Thank You, Modak" response
      if (thankYouBtn) {
        thankYouBtn.addEventListener("click", (e) => {
          audioManager.playKissSound();
          spawnHeartBurst(e.clientX, e.clientY, 12, ["💋", "❤️", "🥰", "🌸"]);
          if (modakReply) {
            modakReply.classList.remove("hidden");
          }
        });
      }

      // Continue to Letter section
      if (continueBtn) {
        continueBtn.addEventListener("click", () => {
          audioManager.playRomanticTone(523.25, 0.4);
          if (this.onNextSection) {
            this.onNextSection("letter");
          }
        });
      }

      // Attach flower tap easter egg listeners
      this.attachFlowerClickListeners();

    }, 50);

    return section;
  }

  attachFlowerClickListeners() {
    const container = document.getElementById("bouquet-layered-flowers");
    if (!container) return;

    container.querySelectorAll(".blooming-flower-item").forEach(item => {
      item.addEventListener("click", (e) => {
        const fid = item.getAttribute("data-flower-id") || "rose";
        this.flowerClickCounts[fid] = (this.flowerClickCounts[fid] || 0) + 1;

        audioManager.playBloom();
        spawnHeartBurst(e.clientX, e.clientY, 8, ["🌸", "🌹", "✨", "💐"]);

        if (this.flowerClickCounts[fid] === 3 && this.onSecretTriggered) {
          this.onSecretTriggered("tripleFlower", EASTER_EGGS.tripleFlower);
        }
      });
    });
  }

  renderComposedBouquet() {
    if (this.revealedItemIds.length === 0) return "";

    return BOUQUET_COMPOSITION.map(item => {
      if (!this.revealedItemIds.includes(item.id)) return "";

      const zIndex = item.layer * 5;
      const isRose = item.type === "focal-rose";

      return `
        <div 
          data-flower-id="${item.flowerId || 'foliage'}" 
          class="blooming-flower-item flower-blooming absolute cursor-pointer select-none transition-transform hover:scale-125"
          style="
            left: calc(50% + ${item.x}px);
            top: calc(50% + ${item.y}px);
            transform: translate(-50%, -50%) rotate(${item.rot}deg);
            --target-rot: ${item.rot}deg;
            z-index: ${zIndex};
            font-size: ${item.size}px;
          "
          title="${item.label}"
        >
          <span class="inline-block ${isRose ? 'filter drop-shadow-[0_6px_12px_rgba(244,63,94,0.6)]' : 'filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]'}">
            ${item.emoji}
          </span>
        </div>
      `;
    }).join("");
  }
}
