import type { AppState, WordAction, Word, ReviewRecord } from '../types';
import { saveState } from './localStorage';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function applySpacedRepetition(word: Word, quality: 0 | 1 | 2 | 3 | 4 | 5): Partial<Word> {
  let { easinessFactor, interval, repetitions } = word;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easinessFactor);
    repetitions += 1;
  }

  easinessFactor = Math.max(
    1.3,
    easinessFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);
  const nextReviewDate = nextDate.toISOString().split('T')[0];

  const masteryLevel = Math.min(4, Math.floor(repetitions / 2)) as 0 | 1 | 2 | 3 | 4;

  return { easinessFactor, interval, repetitions, nextReviewDate, masteryLevel };
}

export function wordReducer(state: AppState, action: WordAction): AppState {
  let next: AppState;

  switch (action.type) {
    case 'ADD_WORD': {
      const now = new Date().toISOString();
      const newWord: Word = {
        id: crypto.randomUUID(),
        easinessFactor: 2.5,
        interval: 1,
        repetitions: 0,
        nextReviewDate: today(),
        lastReviewedAt: null,
        masteryLevel: 0,
        totalReviews: 0,
        correctReviews: 0,
        createdAt: now,
        updatedAt: now,
        ...action.payload,
        word: action.payload.word.toLowerCase().trim(),
      };
      next = { ...state, words: [...state.words, newWord] };
      break;
    }

    case 'UPDATE_WORD': {
      const now = new Date().toISOString();
      next = {
        ...state,
        words: state.words.map((w) =>
          w.id === action.payload.id ? { ...w, ...action.payload, updatedAt: now } : w
        ),
      };
      break;
    }

    case 'DELETE_WORD': {
      next = {
        ...state,
        words: state.words.filter((w) => w.id !== action.payload.id),
        reviewHistory: state.reviewHistory.filter((r) => r.wordId !== action.payload.id),
      };
      break;
    }

    case 'RECORD_REVIEW': {
      const { wordId, quality, mode } = action.payload;
      const word = state.words.find((w) => w.id === wordId);
      if (!word) return state;

      const srUpdates = applySpacedRepetition(word, quality);
      const correct = quality >= 3;
      const now = new Date().toISOString();

      const record: ReviewRecord = {
        id: crypto.randomUUID(),
        wordId,
        reviewedAt: now,
        quality,
        mode,
        correct,
      };

      next = {
        ...state,
        words: state.words.map((w) =>
          w.id === wordId
            ? {
                ...w,
                ...srUpdates,
                lastReviewedAt: now,
                totalReviews: w.totalReviews + 1,
                correctReviews: w.correctReviews + (correct ? 1 : 0),
                updatedAt: now,
              }
            : w
        ),
        reviewHistory: [...state.reviewHistory, record],
      };
      break;
    }

    case 'IMPORT_ARTICLE': {
      const existing = state.articles.find((a) => a.id === action.payload.id);
      if (existing) return state;
      next = { ...state, articles: [...state.articles, action.payload] };
      break;
    }

    case 'UPDATE_SETTINGS': {
      next = {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
      break;
    }

    default:
      return state;
  }

  saveState(next);
  return next;
}
