import React, { createContext, useReducer, useContext } from 'react';
import type { AppState, WordAction } from '../types';
import { wordReducer } from './wordReducer';
import { loadState } from './localStorage';

interface WordContextValue {
  state: AppState;
  dispatch: React.Dispatch<WordAction>;
}

const WordContext = createContext<WordContextValue | null>(null);

export function WordProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wordReducer, undefined, loadState);

  return (
    <WordContext.Provider value={{ state, dispatch }}>
      {children}
    </WordContext.Provider>
  );
}

export function useWordContext(): WordContextValue {
  const ctx = useContext(WordContext);
  if (!ctx) throw new Error('useWordContext must be used within WordProvider');
  return ctx;
}
