import { audioManager } from "../utils/audioManager.js";
import { spawnHeartBurst } from "../utils/particles.js";

export class FloatingNavComponent {
  constructor({ activeChapter, onNavigate, onOpenAchievements, onOpenDailyNote, onResetJourney, achievementsCount, totalAchievements }) {
    this.activeChapter = activeChapter;
    this.onNavigate = onNavigate;
    this.onOpenAchievements = onOpenAchievements;
    this.onOpenDailyNote = onOpenDailyNote;
    this.onResetJourney = onResetJourney;
    this.achievementsCount = achievementsCount || 0;
    this.totalAchievements = totalAchievements || 8;
  }

  render() {
    const nav = document.createElement("nav");
    nav.id = "floating-navigation";
    nav.className = "fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-lg transition-all duration-300";
    
    const chapters = [
      { id: "landing", label: "Home", icon: "✨" },
      { id: "story", label: "Story", icon: "📖" },
      { id: "bouquet", label: "Bouquet", icon: "💐" },
      { id: "letter", label: "Letter", icon: "💌" },
      { id: "kiss", label: "Kisses", icon: "💋" },
      { id: "compliments", label: "Reasons", icon: "♾️" },
      { id: "quiz", label: "Quiz", icon: "🥰" },
      { id: "memories", label: "Memories", icon: "📸" },
      { id: "music", label: "Soundtrack", icon: "🎵" },
      { id: "heart-catcher", label: "Heart Game", icon: "🎯" },
      { id: "surprise", label: "Surprise", icon: "🎁" },
      { id: "final", label: "Forever", icon: "💍" },
    ];

    nav.innerHTML = `
      <div class="glass-panel p-2 flex items-center justify-between shadow-2xl border border-purple-400/30 backdrop-blur-xl">
        <!-- Quick Chapter Drawer Toggle / Current Step -->
        <button id="nav-chapters-toggle" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs font-semibold transition-all cursor-pointer">
          <span>✨</span>
          <span class="hidden sm:inline">Explore</span>
          <span class="text-[10px] bg-purple-600/40 px-1.5 py-0.5 rounded-full">Menu</span>
        </button>

        <!-- Chapter Icons Quick Scroll -->
        <div class="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[200px] sm:max-w-[240px] px-1 py-1">
          ${chapters.map(c => `
            <button data-chapter="${c.id}" class="nav-chapter-btn flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${this.activeChapter === c.id ? 'bg-pink-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)] scale-110' : 'bg-white/5 text-purple-200 hover:bg-white/15'}" title="${c.label}">
              ${c.icon}
            </button>
          `).join("")}
        </div>

        <!-- Controls: Music, Achievements, Daily Note -->
        <div class="flex items-center gap-1">
          <!-- Daily Note Button -->
          <button id="nav-daily-note-btn" class="w-8 h-8 rounded-lg bg-pink-500/20 hover:bg-pink-500/40 text-pink-200 flex items-center justify-center text-sm transition-all cursor-pointer" title="A sweet note from Modak">
            💌
          </button>

          <!-- Music Toggle with animated equalizer -->
          <button id="nav-music-toggle" class="w-8 h-8 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 flex items-center justify-center text-sm transition-all cursor-pointer relative" title="Toggle Music">
            <span id="music-icon-indicator">🎵</span>
            <div id="music-wave-bars" class="absolute -top-1 -right-1 flex items-end gap-0.5 h-3">
              <span class="w-0.5 h-2 bg-pink-400 rounded-full animate-bounce"></span>
              <span class="w-0.5 h-3 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></span>
              <span class="w-0.5 h-1.5 bg-rose-300 rounded-full animate-bounce" style="animation-delay: 0.3s"></span>
            </div>
          </button>

          <!-- Achievements Trigger -->
          <button id="nav-achievements-btn" class="relative w-8 h-8 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 flex items-center justify-center text-sm transition-all cursor-pointer" title="Our Love Milestones & Achievements">
            🏆
            <span id="nav-achievement-badge" class="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
              ${this.achievementsCount}
            </span>
          </button>
        </div>
      </div>

      <!-- Quick Navigation Drawer Overlay (Hidden by default) -->
      <div id="nav-drawer-modal" class="hidden absolute bottom-14 left-0 right-0 glass-panel p-4 mb-2 shadow-2xl border border-purple-400/40">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <span class="text-xs font-bold text-pink-300 uppercase tracking-wider">Our Little World — Chapters</span>
          <button id="nav-drawer-close" class="text-xs text-purple-300 hover:text-white px-2 py-1 bg-white/10 rounded-md">Close ✕</button>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
          ${chapters.map(c => `
            <button data-chapter="${c.id}" class="nav-drawer-item flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-all ${this.activeChapter === c.id ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-pink-400/50 text-white font-semibold' : 'bg-white/5 hover:bg-white/10 text-purple-200'}">
              <span class="text-base">${c.icon}</span>
              <span class="truncate">${c.label}</span>
            </button>
          `).join("")}
        </div>
        <div class="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
          <button id="nav-reset-journey-btn" class="text-[11px] text-rose-300/80 hover:text-rose-200 underline cursor-pointer">
            ↺ Start Our Story Again
          </button>
          <span class="text-[10px] text-purple-300/70 font-script text-base">Modak ❤️ Coco</span>
        </div>
      </div>
    `;

    setTimeout(() => {
      // Chapter buttons
      nav.querySelectorAll(".nav-chapter-btn, .nav-drawer-item").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const ch = btn.getAttribute("data-chapter");
          if (ch && this.onNavigate) {
            audioManager.playRomanticTone(440, 0.4);
            const rect = btn.getBoundingClientRect();
            spawnHeartBurst(rect.left + rect.width / 2, rect.top, 5);
            this.onNavigate(ch);
            const drawer = document.getElementById("nav-drawer-modal");
            if (drawer) drawer.classList.add("hidden");
          }
        });
      });

      // Drawer toggle
      const drawerToggle = document.getElementById("nav-chapters-toggle");
      const drawerModal = document.getElementById("nav-drawer-modal");
      const drawerClose = document.getElementById("nav-drawer-close");

      if (drawerToggle && drawerModal) {
        drawerToggle.addEventListener("click", () => {
          audioManager.playRomanticTone(523.25, 0.3);
          drawerModal.classList.toggle("hidden");
        });
      }
      if (drawerClose && drawerModal) {
        drawerClose.addEventListener("click", () => {
          drawerModal.classList.add("hidden");
        });
      }

      // Music toggle
      const musicBtn = document.getElementById("nav-music-toggle");
      const waveBars = document.getElementById("music-wave-bars");
      if (musicBtn) {
        musicBtn.addEventListener("click", () => {
          const isPlaying = audioManager.toggleMusic();
          if (waveBars) {
            waveBars.style.display = isPlaying ? "flex" : "none";
          }
        });
      }

      // Daily note button
      const dailyBtn = document.getElementById("nav-daily-note-btn");
      if (dailyBtn && this.onOpenDailyNote) {
        dailyBtn.addEventListener("click", () => {
          audioManager.playSparkle();
          this.onOpenDailyNote();
        });
      }

      // Achievements button
      const achBtn = document.getElementById("nav-achievements-btn");
      if (achBtn && this.onOpenAchievements) {
        achBtn.addEventListener("click", () => {
          audioManager.playCelebrationChord();
          this.onOpenAchievements();
        });
      }

      // Reset story button
      const resetBtn = document.getElementById("nav-reset-journey-btn");
      if (resetBtn && this.onResetJourney) {
        resetBtn.addEventListener("click", () => {
          if (confirm("Would you like to restart our story journey from the beginning, my Princess? ❤️")) {
            this.onResetJourney();
          }
        });
      }
    }, 50);

    return nav;
  }
}
