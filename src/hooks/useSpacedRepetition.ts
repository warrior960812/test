import type { Word } from '../types';

export function getDueWords(words: Word[]): Word[] {
  const todayStr = new Date().toISOString().split('T')[0];
  return words
    .filter((w) => w.nextReviewDate <= todayStr)
    .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
}

export function getMasteryLabel(level: 0 | 1 | 2 | 3 | 4): string {
  return ['New', 'Learning', 'Familiar', 'Known', 'Mastered'][level];
}

export function getMasteryColor(level: 0 | 1 | 2 | 3 | 4): string {
  return ['#94a3b8', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'][level];
}
