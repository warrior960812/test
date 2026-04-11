import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Word } from '../types';
import { useWords } from '../hooks/useWords';
import { QuizSetup } from '../components/quiz/QuizSetup';
import { QuizSession } from '../components/quiz/QuizSession';
import { QuizResults } from '../components/quiz/QuizResults';

type Phase = 'setup' | 'session' | 'results';

export function QuizPage() {
  const { words } = useWords();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('setup');
  const [quizWords, setQuizWords] = useState<Word[]>([]);
  const [results, setResults] = useState<{ word: Word; quality: number }[]>([]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Quiz</h1>
      </div>
      <div className="page-content-narrow">
        {phase === 'setup' && (
          <QuizSetup
            words={words}
            onStart={(selected) => {
              setQuizWords(selected);
              setPhase('session');
            }}
          />
        )}
        {phase === 'session' && (
          <QuizSession
            words={quizWords}
            onFinish={(r) => {
              setResults(r);
              setPhase('results');
            }}
          />
        )}
        {phase === 'results' && (
          <QuizResults
            results={results}
            onRestart={() => setPhase('setup')}
            onDone={() => navigate('/')}
          />
        )}
      </div>
    </div>
  );
}
