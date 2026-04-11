import type { AppState } from '../types';

const STORAGE_KEY = 'wordwise_v1';

export function defaultState(): AppState {
  return {
    words: [],
    reviewHistory: [],
    articles: [],
    settings: {
      dailyGoal: 10,
      theme: 'light',
    },
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // Merge with defaults to handle missing fields from older versions
    return {
      ...defaultState(),
      ...parsed,
      settings: { ...defaultState().settings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — fail silently
  }
}
