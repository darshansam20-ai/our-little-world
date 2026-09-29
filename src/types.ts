/**
 * 💗 PROJECT TYPE DEFINITIONS - OUR LITTLE WORLD
 */

export interface RelationshipData {
  her: {
    name: string;
    nicknames: string[];
    primaryNickname: string;
    admiration: string;
    uniqueness: string;
  };
  him: {
    name: string;
    nicknames: string[];
    primaryNickname: string;
  };
  dates: {
    firstMet: string;
    firstConversation: string;
    relationshipBegan: string;
    marriageDay: string;
  };
  identity: {
    motto: string;
    concept: string;
    corePromise: string;
    safePlace: string;
  };
  recurringThemes: string[];
}

export interface MemoryItem {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  image: string | null;
  fallbackIcon: string;
  fallbackGradient: string;
  story: string;
  caption: string;
  whyItMatters: string;
  tag: string;
  isDivineCard?: boolean;
}

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  why: string;
  interpretation: string;
  tag: string;
  file: string;
  coverColor: string;
  keyNotes: string[];
  badge?: string;
  isSpecial?: boolean;
  isFavorite?: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  correctFeedback: string;
  wrongFeedback: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FlowerItem {
  id: string;
  name: string;
  meaning: string;
  color: string;
  accent: string;
  emoji: string;
  description: string;
  svgPath: string;
}

export interface StoryChapter {
  number: string;
  title: string;
  subtitle: string;
  tagline: string;
  content: string;
  quote: string;
  highlight: string;
}
