export interface Word {
  id: string;
  word: string;
  definition: string;
  examples: string[];
  notes: string;
  tags: string[];
  sourceArticleTitle?: string;
  sourceArticleUrl?: string;
  // SM-2 spaced repetition fields
  easinessFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewedAt: string | null;
  // Mastery
  masteryLevel: 0 | 1 | 2 | 3 | 4;
  totalReviews: number;
  correctReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRecord {
  id: string;
  wordId: string;
  reviewedAt: string;
  quality: 0 | 1 | 2 | 3 | 4 | 5;
  mode: 'flashcard' | 'typing';
  correct: boolean;
}

export interface Article {
  id: string;
  title: string;
  body: string;
  source?: string;
  importedAt: string;
  savedWordIds: string[];
}

export interface AppSettings {
  dailyGoal: number;
  theme: 'light' | 'dark';
}

export interface AppState {
  words: Word[];
  reviewHistory: ReviewRecord[];
  articles: Article[];
  settings: AppSettings;
}

export type WordAction =
  | { type: 'ADD_WORD'; payload: Omit<Word, 'id' | 'createdAt' | 'updatedAt' | 'easinessFactor' | 'interval' | 'repetitions' | 'nextReviewDate' | 'lastReviewedAt' | 'masteryLevel' | 'totalReviews' | 'correctReviews'> }
  | { type: 'UPDATE_WORD'; payload: { id: string } & Partial<Word> }
  | { type: 'DELETE_WORD'; payload: { id: string } }
  | { type: 'RECORD_REVIEW'; payload: { wordId: string; quality: 0 | 1 | 2 | 3 | 4 | 5; mode: 'flashcard' | 'typing' } }
  | { type: 'IMPORT_ARTICLE'; payload: Article }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> };
