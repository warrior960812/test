import { useState } from 'react';
import type { Word } from '../../types';
import { getDueWords } from '../../hooks/useSpacedRepetition';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';

interface QuizSetupProps {
  words: Word[];
  onStart: (selected: Word[]) => void;
}

export function QuizSetup({ words, onStart }: QuizSetupProps) {
  const dueWords = getDueWords(words);
  const [count, setCount] = useState<number>(Math.min(10, dueWords.length || words.length));
  const [pool, setPool] = useState<'due' | 'all'>('due');

  const source = pool === 'due' ? dueWords : words;
  const available = source.length;

  function handleStart() {
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    onStart(shuffled.slice(0, count));
  }

  if (words.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title="No words to quiz yet"
        description="Add some words to your vocabulary first, then come back to practice."
      />
    );
  }

  return (
    <div className="quiz-setup">
      <h2 className="quiz-setup-title">Start a Quiz</h2>

      <div className="form-group">
        <label className="form-label">Word pool</label>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" value="due" checked={pool === 'due'} onChange={() => setPool('due')} />
            Due for review ({dueWords.length} words)
          </label>
          <label className="radio-label">
            <input type="radio" value="all" checked={pool === 'all'} onChange={() => setPool('all')} />
            All words ({words.length} words)
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Number of cards: <strong>{count}</strong></label>
        <input
          type="range"
          min={1}
          max={available}
          value={Math.min(count, available)}
          onChange={(e) => setCount(Number(e.target.value))}
          disabled={available === 0}
          className="range-input"
        />
        <div className="range-labels">
          <span>1</span><span>{available}</span>
        </div>
      </div>

      {available === 0 ? (
        <p className="quiz-no-words">
          {pool === 'due' ? 'No words due for review today. Switch to "All words" or add more words.' : 'No words available.'}
        </p>
      ) : (
        <Button onClick={handleStart} size="md">
          Start Quiz ({Math.min(count, available)} cards)
        </Button>
      )}
    </div>
  );
}
