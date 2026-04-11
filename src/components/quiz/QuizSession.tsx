import { useState } from 'react';
import type { Word } from '../../types';
import { FlashCard } from './FlashCard';
import { useWords } from '../../hooks/useWords';

interface QuizSessionProps {
  words: Word[];
  onFinish: (results: { word: Word; quality: number }[]) => void;
}

export function QuizSession({ words, onFinish }: QuizSessionProps) {
  const { recordReview } = useWords();
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<{ word: Word; quality: number }[]>([]);

  function handleRate(quality: 0 | 1 | 2 | 3 | 4 | 5) {
    const current = words[index];
    recordReview(current.id, quality, 'flashcard');
    const newResults = [...results, { word: current, quality }];
    if (index + 1 >= words.length) {
      onFinish(newResults);
    } else {
      setResults(newResults);
      setIndex(index + 1);
    }
  }

  return (
    <FlashCard
      word={words[index]}
      onRate={handleRate}
      cardNumber={index + 1}
      total={words.length}
    />
  );
}
