import { useWordContext } from '../store/WordContext';
import type { Word } from '../types';

export function useWords() {
  const { state, dispatch } = useWordContext();

  function addWord(payload: Omit<Word, 'id' | 'createdAt' | 'updatedAt' | 'easinessFactor' | 'interval' | 'repetitions' | 'nextReviewDate' | 'lastReviewedAt' | 'masteryLevel' | 'totalReviews' | 'correctReviews'>) {
    dispatch({ type: 'ADD_WORD', payload });
  }

  function updateWord(id: string, fields: Partial<Word>) {
    dispatch({ type: 'UPDATE_WORD', payload: { id, ...fields } });
  }

  function deleteWord(id: string) {
    dispatch({ type: 'DELETE_WORD', payload: { id } });
  }

  function recordReview(wordId: string, quality: 0 | 1 | 2 | 3 | 4 | 5, mode: 'flashcard' | 'typing') {
    dispatch({ type: 'RECORD_REVIEW', payload: { wordId, quality, mode } });
  }

  function wordExists(w: string): boolean {
    return state.words.some((x) => x.word === w.toLowerCase().trim());
  }

  function getWordByText(w: string): Word | undefined {
    return state.words.find((x) => x.word === w.toLowerCase().trim());
  }

  return {
    words: state.words,
    articles: state.articles,
    reviewHistory: state.reviewHistory,
    settings: state.settings,
    dispatch,
    addWord,
    updateWord,
    deleteWord,
    recordReview,
    wordExists,
    getWordByText,
  };
}
