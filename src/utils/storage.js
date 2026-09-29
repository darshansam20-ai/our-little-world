/**
 * 💾 LOCAL STORAGE MANAGER - Our Little World State Persistence
 */

const STORAGE_KEY = "our_little_world_darshan_chanchal_v1";

const DEFAULT_STATE = {
  unlockedChapters: ["landing"],
  activeChapter: "landing",
  kissCount: 0,
  quizCompleted: false,
  quizScore: 0,
  bouquet: ["rose", "tulip", "lavender"],
  heartHighScore: 0,
  easterEggsFound: [],
  achievements: [],
  hasAcceptedSurprise: false,
  hasReceivedBouquet: false,
  musicMuted: false,
  sfxMuted: false,
  hasOpenedLetter: false,
  storyProgressIndex: 0,
  visitedAt: new Date().toISOString(),
};

export class StorageManager {
  static load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_STATE, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
    return { ...DEFAULT_STATE };
  }

  static save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  static resetGameProgress(currentSettings = {}) {
    const freshState = {
      ...DEFAULT_STATE,
      unlockedChapters: ["landing"],
      activeChapter: "landing",
      kissCount: 0,
      quizCompleted: false,
      quizScore: 0,
      bouquet: ["rose", "tulip", "lavender"],
      heartHighScore: 0,
      easterEggsFound: [],
      achievements: [],
      hasAcceptedSurprise: false,
      hasReceivedBouquet: false,
      hasOpenedLetter: false,
      storyProgressIndex: 0,
      musicMuted: currentSettings.musicMuted !== undefined ? currentSettings.musicMuted : false,
      sfxMuted: currentSettings.sfxMuted !== undefined ? currentSettings.sfxMuted : false,
      visitedAt: new Date().toISOString(),
    };
    StorageManager.save(freshState);
    return freshState;
  }

  static reset() {
    return StorageManager.resetGameProgress();
  }
}

