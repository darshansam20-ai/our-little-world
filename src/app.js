import { StorageManager } from "./utils/storage.js";
import { audioManager } from "./utils/audioManager.js";
import { ACHIEVEMENTS } from "./data/easterEggs.js";
import { AmbientBackgroundComponent } from "./components/AmbientBackground.js";
import { FloatingNavComponent } from "./components/FloatingNav.js";
import { AchievementsModalComponent } from "./components/AchievementsModal.js";
import { DailyMessageModalComponent } from "./components/DailyMessageModal.js";
import { EatingModakModalComponent } from "./components/EatingModakModal.js";
import { BreakDanceModalComponent } from "./components/BreakDanceModal.js";
import { SoundPromptModalComponent } from "./components/SoundPromptModal.js";

import { LandingSectionComponent } from "./sections/LandingSection.js";
import { StoryModeSectionComponent } from "./sections/StoryModeSection.js";
import { BouquetSectionComponent } from "./sections/BouquetSection.js";
import { LetterSectionComponent } from "./sections/LetterSection.js";
import { KissSectionComponent } from "./sections/KissSection.js";
import { ComplimentsSectionComponent } from "./sections/ComplimentsSection.js";
import { QuizSectionComponent } from "./sections/QuizSection.js";
import { MemoriesSectionComponent } from "./sections/MemoriesSection.js";
import { MusicRoomSectionComponent } from "./sections/MusicRoomSection.js";
import { HeartGameSectionComponent } from "./sections/HeartGameSection.js";
import { SurpriseBoxSectionComponent } from "./sections/SurpriseBoxSection.js";
import { FinalChapterSectionComponent } from "./sections/FinalChapterSection.js";

export class OurLittleWorldApp {
  constructor() {
    this.state = StorageManager.load();
    this.rootEl = document.getElementById("app-root");
    this.navInstance = null;
    this.activeModal = null;
  }

  init() {
    // Check initial mute preferences
    audioManager.isMuted = !!this.state.musicMuted;
    audioManager.sfxMuted = !!this.state.sfxMuted;

    // Render static ambient background
    const bgComp = new AmbientBackgroundComponent((key, msg) => {
      this.handleSecretFound(key, msg);
    });
    document.body.appendChild(bgComp.render());

    // Show initial sound prompt if not visited or on first enter
    setTimeout(() => {
      const prompt = new SoundPromptModalComponent((musicOn) => {
        this.state.musicMuted = !musicOn;
        this.saveState();
      });
      document.body.appendChild(prompt.render());
    }, 600);

    // Initial render of active chapter
    this.renderSection(this.state.activeChapter || "landing");
    this.renderNav();
  }

  saveState() {
    StorageManager.save(this.state);
  }

  showToast(title, message, icon = "✨") {
    const existing = document.getElementById("love-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "love-toast";
    toast.className = "fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-panel px-4 py-3 border border-pink-400/50 shadow-2xl flex items-center gap-3 animate-fadeIn max-w-sm w-[90%]";
    toast.innerHTML = `
      <span class="text-2xl">${icon}</span>
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold text-pink-200">${title}</h4>
        <p class="text-[11px] text-purple-100/90 truncate">${message}</p>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("opacity-0", "transition-opacity");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  handleSecretFound(key, message) {
    if (!this.state.easterEggsFound.includes(key)) {
      this.state.easterEggsFound.push(key);
      this.unlockAchievement("secret-finder");
      this.saveState();
    }
    this.showToast("Secret Found! 🪄", message, "💖");
  }

  unlockAchievement(achievementId) {
    if (!this.state.achievements.includes(achievementId)) {
      this.state.achievements.push(achievementId);
      this.saveState();
      
      const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
      if (ach) {
        this.showToast("Achievement Unlocked! 🏆", `${ach.title}: ${ach.description}`, "💍");
      }
      this.renderNav();
    }
  }

  renderNav() {
    const oldNav = document.getElementById("floating-navigation");
    if (oldNav) oldNav.remove();

    this.navInstance = new FloatingNavComponent({
      activeChapter: this.state.activeChapter,
      achievementsCount: this.state.achievements.length,
      totalAchievements: ACHIEVEMENTS.length,
      onNavigate: (ch) => this.navigateTo(ch),
      onOpenAchievements: () => this.openAchievementsModal(),
      onOpenDailyNote: () => this.openDailyNoteModal(),
      onResetJourney: () => this.restartJourney(),
    });

    document.body.appendChild(this.navInstance.render());
  }

  navigateTo(chapterId) {
    this.state.activeChapter = chapterId;
    if (!this.state.unlockedChapters.includes(chapterId)) {
      this.state.unlockedChapters.push(chapterId);
    }
    this.saveState();
    this.renderSection(chapterId);
    this.renderNav();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  restartJourney() {
    this.state = StorageManager.reset();
    this.state.activeChapter = "landing";
    this.saveState();
    this.renderSection("landing");
    this.renderNav();
    this.showToast("Fresh Start ❤️", "Welcome back to the beginning of our story.", "✨");
  }

  openAchievementsModal() {
    const modal = new AchievementsModalComponent(this.state.achievements, () => {
      this.activeModal = null;
    });
    document.body.appendChild(modal.render());
  }

  openDailyNoteModal() {
    const modal = new DailyMessageModalComponent(() => {
      this.activeModal = null;
    });
    document.body.appendChild(modal.render());
  }

  openModakEatingModal() {
    this.handleSecretFound("eatModakQuirk", "Coco's favorite hobby detected!");
    const modal = new EatingModakModalComponent(() => {
      this.activeModal = null;
    });
    document.body.appendChild(modal.render());
  }

  openBreakDanceModal() {
    const modal = new BreakDanceModalComponent(() => {
      this.activeModal = null;
    });
    document.body.appendChild(modal.render());
  }

  renderSection(chapterId) {
    if (!this.rootEl) return;
    this.rootEl.innerHTML = "";

    let component = null;

    switch (chapterId) {
      case "landing":
        component = new LandingSectionComponent({
          onEnterWorld: () => this.navigateTo("story"),
          onOpenSoundPrompt: () => {},
        });
        break;

      case "story":
        component = new StoryModeSectionComponent({
          onNextSection: (next) => this.navigateTo(next),
          onUnlockAchievement: (ach) => this.unlockAchievement(ach),
        });
        break;

      case "bouquet":
        component = new BouquetSectionComponent({
          isRevealed: !!this.state.hasReceivedBouquet,
          onBouquetRevealed: () => {
            this.state.hasReceivedBouquet = true;
            this.saveState();
          },
          onNextSection: (next) => this.navigateTo(next),
          onUnlockAchievement: (ach) => this.unlockAchievement(ach),
          onSecretTriggered: (key, msg) => this.handleSecretFound(key, msg),
        });
        break;

      case "letter":
        component = new LetterSectionComponent({
          onNextSection: (next) => this.navigateTo(next),
        });
        break;

      case "kiss":
        component = new KissSectionComponent({
          initialKissCount: this.state.kissCount || 0,
          onKissAdded: (count) => {
            this.state.kissCount = count;
            this.saveState();
          },
          onNextSection: (next) => this.navigateTo(next),
          onUnlockAchievement: (ach) => this.unlockAchievement(ach),
        });
        break;

      case "compliments":
        component = new ComplimentsSectionComponent({
          onOpenModakJoke: () => this.openModakEatingModal(),
          onNextSection: (next) => this.navigateTo(next),
        });
        break;

      case "quiz":
        component = new QuizSectionComponent({
          onQuizCompleted: (score) => {
            this.state.quizCompleted = true;
            this.state.quizScore = score;
            this.saveState();
          },
          onNextSection: (next) => this.navigateTo(next),
          onUnlockAchievement: (ach) => this.unlockAchievement(ach),
        });
        break;

      case "memories":
        component = new MemoriesSectionComponent({
          onOpenBreakDance: () => this.openBreakDanceModal(),
          onUnlockAchievement: (ach) => this.unlockAchievement(ach),
          onNextSection: (next) => this.navigateTo(next),
        });
        break;

      case "music":
        component = new MusicRoomSectionComponent({
          onNextSection: (next) => this.navigateTo(next),
        });
        break;

      case "heart-catcher":
        component = new HeartGameSectionComponent({
          highScore: this.state.heartHighScore || 0,
          onScoreUpdate: (score) => {
            if (score > (this.state.heartHighScore || 0)) {
              this.state.heartHighScore = score;
              this.saveState();
            }
          },
          onNextSection: (next) => this.navigateTo(next),
          onUnlockAchievement: (ach) => this.unlockAchievement(ach),
        });
        break;

      case "surprise":
        component = new SurpriseBoxSectionComponent({
          hasAcceptedSurprise: !!this.state.hasAcceptedSurprise,
          onAcceptSurprise: () => {
            this.state.hasAcceptedSurprise = true;
            this.saveState();
          },
          onNextSection: (next) => this.navigateTo(next),
        });
        break;

      case "final":
        component = new FinalChapterSectionComponent({
          onUnlockAchievement: (ach) => this.unlockAchievement(ach),
          onRestartJourney: () => this.restartJourney(),
        });
        break;

      default:
        component = new LandingSectionComponent({
          onEnterWorld: () => this.navigateTo("story"),
        });
        break;
    }

    if (component) {
      this.rootEl.appendChild(component.render());
    }
  }
}

// Bootstrap on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new OurLittleWorldApp();
  app.init();
});
