import { STORY_CHAPTERS } from "../data/story.js";
import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst } from "../utils/particles.js";

export class StoryModeSectionComponent {
  constructor({ onNextSection, onUnlockAchievement }) {
    this.onNextSection = onNextSection;
    this.onUnlockAchievement = onUnlockAchievement;
    this.currentChapterIndex = 0;
  }

  render() {
    const section = document.createElement("section");
    section.id = "section-story";
    section.className = "min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative z-10 animate-fadeIn";

    const renderChapterContent = (idx) => {
      const ch = STORY_CHAPTERS[idx];
      return `
        <!-- Chapter Header -->
        <div class="flex items-center justify-between gap-2 mb-4 border-b border-white/10 pb-3">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 font-mono text-xs font-bold border border-pink-400/30">
              Chapter ${ch.number}
            </span>
            <span class="text-xs text-purple-300/80 font-medium">${ch.tagline}</span>
          </div>
          <span class="text-xs text-pink-300/60 font-script text-base">Our Story</span>
        </div>

        <!-- Title -->
        <h2 class="text-2xl sm:text-3xl font-heading font-bold text-gradient-rose tracking-tight leading-snug mb-1">
          ${ch.title}
        </h2>
        <p class="text-xs sm:text-sm text-purple-200/70 mb-5 font-medium">
          ${ch.subtitle}
        </p>

        <!-- Chapter Body -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 text-left space-y-4 mb-6 relative overflow-hidden">
          <p class="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-serif">
            ${ch.content}
          </p>

          <div class="p-3.5 rounded-xl bg-purple-900/30 border border-purple-400/30 text-center">
            <p class="text-xs sm:text-sm font-handwritten text-pink-200 font-semibold italic">
              ${ch.quote}
            </p>
          </div>

          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-400/20 text-[11px] text-pink-300 font-semibold">
            <span>✨</span>
            <span>${ch.highlight}</span>
          </div>
        </div>

        <!-- Carousel Navigation Controls -->
        <div class="flex items-center justify-between gap-3">
          <button id="story-prev-btn" class="btn-secondary-romantic text-xs px-4 py-2.5 ${idx === 0 ? 'opacity-40 pointer-events-none' : ''}">
            ← Previous
          </button>

          <!-- Step Dots -->
          <div class="flex items-center gap-1.5">
            ${STORY_CHAPTERS.map((_, dotIdx) => `
              <span class="w-2 h-2 rounded-full transition-all ${dotIdx === idx ? 'bg-pink-400 w-5 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-white/20'}"></span>
            `).join("")}
          </div>

          <button id="story-next-btn" class="btn-romantic text-xs px-5 py-2.5">
            ${idx === STORY_CHAPTERS.length - 1 ? 'Receive Bouquet 💐' : 'Next Chapter →'}
          </button>
        </div>
      `;
    };

    section.innerHTML = `
      <div class="max-w-xl w-full mx-auto">
        <div class="text-center mb-6">
          <span class="text-3xl inline-block mb-1 animate-float">📖</span>
          <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-gradient-lavender">Our Story</h1>
          <p class="text-xs text-purple-200/80 mt-1">From a quiet Instagram message to our forever Navra-Bayko</p>
        </div>

        <div id="story-card-container" class="glass-panel p-6 sm:p-8 shadow-2xl border border-purple-400/30 transition-all duration-300">
          ${renderChapterContent(this.currentChapterIndex)}
        </div>
      </div>
    `;

    const attachEvents = () => {
      const container = document.getElementById("story-card-container");
      const prevBtn = document.getElementById("story-prev-btn");
      const nextBtn = document.getElementById("story-next-btn");

      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          if (this.currentChapterIndex > 0) {
            audioManager.playRomanticTone(392, 0.3);
            this.currentChapterIndex--;
            container.style.opacity = "0";
            setTimeout(() => {
              container.innerHTML = renderChapterContent(this.currentChapterIndex);
              container.style.opacity = "1";
              attachEvents();
            }, 150);
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
          if (this.currentChapterIndex < STORY_CHAPTERS.length - 1) {
            audioManager.playRomanticTone(523.25, 0.4);
            spawnHeartBurst(e.clientX, e.clientY, 6, ["❤️", "✨", "📖"]);
            this.currentChapterIndex++;
            container.style.opacity = "0";
            setTimeout(() => {
              container.innerHTML = renderChapterContent(this.currentChapterIndex);
              container.style.opacity = "1";
              attachEvents();
            }, 150);
          } else {
            // Completed all chapters
            audioManager.playCelebrationChord();
            spawnHeartBurst(e.clientX, e.clientY, 15, ["💐", "❤️", "💍", "✨"]);
            if (this.onUnlockAchievement) {
              this.onUnlockAchievement("navra-bayko");
            }
            if (this.onNextSection) {
              this.onNextSection("bouquet");
            }
          }
        });
      }
    };

    setTimeout(attachEvents, 50);

    return section;
  }
}
