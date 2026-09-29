import { MEMORIES } from "../data/memories.js";
import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst } from "../utils/particles.js";

export class MemoriesSectionComponent {
  constructor({ onOpenBreakDance, onUnlockAchievement, onNextSection }) {
    this.onOpenBreakDance = onOpenBreakDance;
    this.onUnlockAchievement = onUnlockAchievement;
    this.onNextSection = onNextSection;
  }

  render() {
    const section = document.createElement("section");
    section.id = "section-memories";
    section.className = "min-h-screen py-10 px-4 md:px-6 relative z-10 animate-fadeIn";

    section.innerHTML = `
      <div class="max-w-2xl w-full mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <span class="text-3xl inline-block mb-1 animate-float">📸</span>
          <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-gradient-rose">Memory Lane</h1>
          <p class="text-xs text-purple-200/80 mt-1">Our most cherished milestones, etched in our hearts forever</p>
          
          <!-- Break-Dance Ride Bonus Memory Button -->
          <div class="mt-4">
            <button id="memories-breakdance-btn" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold hover:bg-amber-500/30 transition-all cursor-pointer">
              <span>🎢</span>
              <span>Funny Memory: The Break-Dance Ride 😂</span>
            </button>
          </div>
        </div>

        <!-- Vertical Cinematic Timeline -->
        <div class="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:bg-gradient-to-b before:from-pink-500/40 before:via-purple-500/40 before:to-pink-500/10">
          
          ${MEMORIES.map((m, idx) => {
            const isEven = idx % 2 === 0;
            return `
              <div class="relative flex flex-col sm:flex-row items-start ${isEven ? 'sm:flex-row-reverse' : ''} gap-4 sm:gap-8 group">
                
                <!-- Timeline Dot Indicator -->
                <div class="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-purple-900 border-2 border-pink-400 flex items-center justify-center text-xs z-10 shadow-[0_0_12px_rgba(244,63,94,0.6)] group-hover:scale-110 transition-transform">
                  ❤️
                </div>

                <!-- Memory Card -->
                <div class="ml-10 sm:ml-0 sm:w-[calc(50%-1.5rem)] glass-panel p-5 sm:p-6 border border-purple-400/30 hover:border-pink-400/50 transition-all duration-300 shadow-xl">
                  
                  <!-- Tag & Date -->
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30">
                      ${m.date}
                    </span>
                    <span class="text-[10px] text-purple-300/80 font-semibold">${m.tag}</span>
                  </div>

                  <!-- Title -->
                  <h3 class="text-base sm:text-lg font-heading font-bold text-pink-200 mb-2">
                    ${m.title}
                  </h3>

                  <!-- Image / Fallback Art Container -->
                  <div class="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden mb-3.5 bg-gradient-to-br ${m.fallbackGradient} border border-white/10 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(192,132,252,0.2)]">
                    ${m.isDivineCard ? `
                      <!-- Divine Ganpati Blessing Illustration Card -->
                      <div class="text-center p-4">
                        <span class="text-4xl select-none inline-block mb-1 animate-pulse-slow">🌺 🕉️ 🌺</span>
                        <h4 class="text-xs font-bold text-amber-200 uppercase tracking-widest">Divine Blessings</h4>
                        <p class="text-[11px] text-amber-100/80 font-serif italic mt-1">“Under the sacred grace of Ganpati Bappa, we chose our forever.”</p>
                      </div>
                    ` : `
                      <!-- Real photo with graceful fallback artwork -->
                      <img src="${m.image}" alt="${m.title}" loading="lazy" style="object-position: ${m.objectPosition || '50% 50%'};" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                      
                      <div class="fallback-art-container hidden w-full h-full flex flex-col items-center justify-center p-4 text-center">
                        <span class="text-4xl mb-1 select-none">✨</span>
                        <span class="text-xs font-semibold text-pink-200">${m.subtitle || m.title}</span>
                        <span class="text-[10px] text-purple-300/70 font-mono mt-0.5">Placeholder: ${m.image ? m.image.split('/').pop() : ''}</span>
                      </div>
                    `}
                  </div>

                  <!-- Story -->
                  <p class="text-xs text-purple-100/90 leading-relaxed font-serif mb-3">
                    ${m.story}
                  </p>

                  <!-- Caption Box -->
                  <div class="p-2.5 rounded-xl bg-purple-950/40 border border-purple-400/20 mb-2">
                    <p class="text-xs font-handwritten text-pink-200 font-semibold italic">
                      ${m.caption}
                    </p>
                  </div>

                  <!-- Why this moment matters -->
                  <div class="text-[11px] text-purple-300/80 font-medium flex items-center gap-1.5">
                    <span class="text-pink-400">💍</span>
                    <span>${m.whyItMatters}</span>
                  </div>

                </div>

              </div>
            `;
          }).join("")}

        </div>

        <!-- Continue Button -->
        <div class="mt-12 text-center">
          <button id="memories-continue-btn" class="btn-romantic text-xs sm:text-sm py-3 px-8 shadow-xl">
            <span>Enter Our Music Room</span>
            <span>🎵</span>
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      // Check Mini 🧸 memory milestone
      if (this.onUnlockAchievement) {
        this.onUnlockAchievement("mini-guardian");
      }

      // Break dance modal button
      const breakdanceBtn = document.getElementById("memories-breakdance-btn");
      if (breakdanceBtn && this.onOpenBreakDance) {
        breakdanceBtn.addEventListener("click", () => {
          audioManager.playSparkle();
          this.onOpenBreakDance();
        });
      }

      // Continue button
      const contBtn = document.getElementById("memories-continue-btn");
      if (contBtn) {
        contBtn.addEventListener("click", () => {
          audioManager.playRomanticTone(523.25, 0.4);
          if (this.onNextSection) {
            this.onNextSection("music");
          }
        });
      }
    }, 50);

    return section;
  }
}
