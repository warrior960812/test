import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWords } from '../hooks/useWords';
import { WordForm } from '../components/word/WordForm';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { getMasteryLabel, getMasteryColor } from '../hooks/useSpacedRepetition';

export function WordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { words, updateWord, deleteWord } = useWords();
  const [editing, setEditing] = useState(false);

  const word = words.find((w) => w.id === id);

  if (!word) {
    return (
      <div className="page">
        <p>Word not found.</p>
        <Button variant="secondary" onClick={() => navigate('/vocab')}>Back to vocabulary</Button>
      </div>
    );
  }

  function handleDelete() {
    if (confirm(`Delete "${word!.word}" from your vocabulary?`)) {
      deleteWord(word!.id);
      navigate('/vocab');
    }
  }

  if (editing) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Edit: {word.word}</h1>
        </div>
        <div className="page-content-narrow">
          <WordForm
            initial={word}
            onSubmit={(data) => {
              updateWord(word.id, data);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
            submitLabel="Save changes"
          />
        </div>
      </div>
    );
  }

  const accuracy = word.totalReviews > 0
    ? Math.round((word.correctReviews / word.totalReviews) * 100)
    : null;

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/vocab')}>← Back</button>
        <div className="page-header-actions">
          <Button variant="secondary" onClick={() => setEditing(true)}>Edit</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="word-detail">
        <div className="word-detail-top">
          <h1 className="word-detail-word">{word.word}</h1>
          <Badge label={getMasteryLabel(word.masteryLevel)} color={getMasteryColor(word.masteryLevel)} />
        </div>

        <section className="word-detail-section">
          <h3>Definition</h3>
          <p>{word.definition}</p>
        </section>

        {word.examples.length > 0 && (
          <section className="word-detail-section">
            <h3>Examples</h3>
            <ul className="examples-list">
              {word.examples.map((ex, i) => <li key={i}>"{ex}"</li>)}
            </ul>
          </section>
        )}

        {word.notes && (
          <section className="word-detail-section">
            <h3>Notes</h3>
            <p>{word.notes}</p>
          </section>
        )}

        {word.tags.length > 0 && (
          <section className="word-detail-section">
            <h3>Tags</h3>
            <div className="tag-list">
              {word.tags.map((t) => <Badge key={t} label={t} />)}
            </div>
          </section>
        )}

        <section className="word-detail-section word-detail-stats">
          <h3>Stats</h3>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-value">{word.totalReviews}</span>
              <span className="stat-label">Total reviews</span>
            </div>
            <div className="stat">
              <span className="stat-value">{accuracy !== null ? `${accuracy}%` : '—'}</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat">
              <span className="stat-value">{word.interval}d</span>
              <span className="stat-label">Next interval</span>
            </div>
            <div className="stat">
              <span className="stat-value">{word.nextReviewDate}</span>
              <span className="stat-label">Next review</span>
            </div>
          </div>
        </section>

        {word.sourceArticleTitle && (
          <section className="word-detail-section">
            <h3>Source</h3>
            <p>
              From article: <em>{word.sourceArticleTitle}</em>
              {word.sourceArticleUrl && (
                <> — <a href={word.sourceArticleUrl} target="_blank" rel="noreferrer">View</a></>
              )}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
