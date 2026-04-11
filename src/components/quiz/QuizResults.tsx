import type { Word } from '../../types';
import { Button } from '../common/Button';
import { getMasteryLabel, getMasteryColor } from '../../hooks/useSpacedRepetition';
import { Badge } from '../common/Badge';

interface QuizResultsProps {
  results: { word: Word; quality: number }[];
  onRestart: () => void;
  onDone: () => void;
}

export function QuizResults({ results, onRestart, onDone }: QuizResultsProps) {
  const correct = results.filter((r) => r.quality >= 3).length;
  const pct = results.length > 0 ? Math.round((correct / results.length) * 100) : 0;

  const needsWork = results.filter((r) => r.quality < 3);
  const knewWell = results.filter((r) => r.quality >= 3);

  return (
    <div className="quiz-results">
      <div className="results-score">
        <div className="results-circle" style={{ '--score-pct': pct } as React.CSSProperties}>
          <span className="results-pct">{pct}%</span>
          <span className="results-label">correct</span>
        </div>
        <p className="results-summary">{correct} / {results.length} words recalled</p>
      </div>

      {needsWork.length > 0 && (
        <div className="results-section">
          <h3 className="results-section-title">Needs more practice</h3>
          <div className="results-word-list">
            {needsWork.map(({ word }) => (
              <div key={word.id} className="results-word-item results-word-missed">
                <span>{word.word}</span>
                <Badge label={getMasteryLabel(word.masteryLevel)} color={getMasteryColor(word.masteryLevel)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {knewWell.length > 0 && (
        <div className="results-section">
          <h3 className="results-section-title">Knew well</h3>
          <div className="results-word-list">
            {knewWell.map(({ word }) => (
              <div key={word.id} className="results-word-item results-word-correct">
                <span>{word.word}</span>
                <Badge label={getMasteryLabel(word.masteryLevel)} color={getMasteryColor(word.masteryLevel)} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="results-actions">
        <Button variant="secondary" onClick={onRestart}>Quiz again</Button>
        <Button onClick={onDone}>Back to dashboard</Button>
      </div>
    </div>
  );
}
