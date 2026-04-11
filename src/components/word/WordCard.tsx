import { useNavigate } from 'react-router-dom';
import type { Word } from '../../types';
import { Badge } from '../common/Badge';
import { getMasteryLabel, getMasteryColor } from '../../hooks/useSpacedRepetition';

interface WordCardProps {
  word: Word;
  onClick?: () => void;
}

export function WordCard({ word, onClick }: WordCardProps) {
  const navigate = useNavigate();

  function handleClick() {
    if (onClick) onClick();
    else navigate(`/vocab/${word.id}`);
  }

  const dueToday = word.nextReviewDate <= new Date().toISOString().split('T')[0];

  return (
    <div className="word-card" onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
      <div className="word-card-header">
        <span className="word-card-word">{word.word}</span>
        <div className="word-card-meta">
          {dueToday && <span className="due-dot" title="Due for review" />}
          <Badge
            label={getMasteryLabel(word.masteryLevel)}
            color={getMasteryColor(word.masteryLevel)}
          />
        </div>
      </div>
      <p className="word-card-def">{word.definition}</p>
      {word.tags.length > 0 && (
        <div className="word-card-tags">
          {word.tags.map((t) => <Badge key={t} label={t} />)}
        </div>
      )}
    </div>
  );
}
