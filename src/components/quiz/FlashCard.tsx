import { useState } from 'react';
import type { Word } from '../../types';
import { Button } from '../common/Button';

interface FlashCardProps {
  word: Word;
  onRate: (quality: 0 | 1 | 2 | 3 | 4 | 5) => void;
  cardNumber: number;
  total: number;
}

const RATINGS: { quality: 0 | 1 | 2 | 3 | 4 | 5; label: string; desc: string; variant: 'danger' | 'secondary' | 'primary' }[] = [
  { quality: 1, label: 'Forgot', desc: 'No idea', variant: 'danger' },
  { quality: 2, label: 'Hard', desc: 'Recalled with difficulty', variant: 'secondary' },
  { quality: 3, label: 'Good', desc: 'Recalled correctly', variant: 'primary' },
  { quality: 5, label: 'Easy', desc: 'Instantly recalled', variant: 'primary' },
];

export function FlashCard({ word, onRate, cardNumber, total }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flashcard-wrap">
      <div className="flashcard-progress">Card {cardNumber} of {total}</div>

      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <p className="flashcard-hint">Definition — click to reveal word</p>
            <p className="flashcard-definition">{word.definition}</p>
            {word.examples.length > 0 && (
              <p className="flashcard-example">"{word.examples[0]}"</p>
            )}
          </div>
          <div className="flashcard-back">
            <p className="flashcard-hint">Word</p>
            <h2 className="flashcard-word">{word.word}</h2>
            {word.notes && <p className="flashcard-notes">{word.notes}</p>}
          </div>
        </div>
      </div>

      {flipped && (
        <div className="flashcard-ratings">
          <p className="flashcard-rate-label">How well did you know this?</p>
          <div className="rating-buttons">
            {RATINGS.map((r) => (
              <button
                key={r.quality}
                className={`rating-btn rating-btn-${r.variant}`}
                onClick={() => { setFlipped(false); onRate(r.quality); }}
                title={r.desc}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {!flipped && (
        <div className="flashcard-flip-hint">
          <Button variant="ghost" onClick={() => setFlipped(true)}>Reveal answer</Button>
        </div>
      )}
    </div>
  );
}
