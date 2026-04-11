import { useNavigate } from 'react-router-dom';
import { useWords } from '../hooks/useWords';
import { getDueWords, getMasteryLabel, getMasteryColor } from '../hooks/useSpacedRepetition';
import { WordCard } from '../components/word/WordCard';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { ProgressBar } from '../components/common/ProgressBar';

export function DashboardPage() {
  const { words, reviewHistory, settings } = useWords();
  const navigate = useNavigate();

  const dueWords = getDueWords(words);
  const recentWords = [...words]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  // Today's reviews
  const today = new Date().toISOString().split('T')[0];
  const reviewedToday = reviewHistory.filter((r) => r.reviewedAt.startsWith(today)).length;

  // Mastery breakdown
  const masteryCount = [0, 1, 2, 3, 4].map((level) =>
    words.filter((w) => w.masteryLevel === level).length
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-card-value">{words.length}</span>
          <span className="stat-card-label">Total words</span>
        </div>
        <div className="stat-card stat-card-accent">
          <span className="stat-card-value">{dueWords.length}</span>
          <span className="stat-card-label">Due today</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value">{reviewedToday}</span>
          <span className="stat-card-label">Reviewed today</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value">
            {words.filter((w) => w.masteryLevel === 4).length}
          </span>
          <span className="stat-card-label">Mastered</span>
        </div>
      </div>

      {/* Daily goal */}
      <div className="dashboard-section">
        <h2 className="section-title">Daily goal</h2>
        <ProgressBar value={reviewedToday} max={settings.dailyGoal} label={`${reviewedToday} / ${settings.dailyGoal} reviews`} />
      </div>

      {/* Mastery breakdown */}
      {words.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title">Mastery breakdown</h2>
          <div className="mastery-bar">
            {masteryCount.map((count, level) => {
              if (count === 0) return null;
              const pct = (count / words.length) * 100;
              return (
                <div
                  key={level}
                  className="mastery-segment"
                  style={{ width: `${pct}%`, backgroundColor: getMasteryColor(level as 0|1|2|3|4) }}
                  title={`${getMasteryLabel(level as 0|1|2|3|4)}: ${count}`}
                />
              );
            })}
          </div>
          <div className="mastery-legend">
            {[0, 1, 2, 3, 4].map((level) => (
              <span key={level} className="mastery-legend-item">
                <span className="mastery-dot" style={{ backgroundColor: getMasteryColor(level as 0|1|2|3|4) }} />
                {getMasteryLabel(level as 0|1|2|3|4)} ({masteryCount[level]})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Due words */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Due for review</h2>
          {dueWords.length > 0 && (
            <Button onClick={() => navigate('/quiz')}>Start review</Button>
          )}
        </div>
        {dueWords.length === 0 ? (
          <p className="dashboard-empty-msg">
            {words.length === 0
              ? 'No words yet. Add some words to start learning!'
              : 'All caught up! No words due today.'}
          </p>
        ) : (
          <div className="word-grid word-grid-sm">
            {dueWords.slice(0, 6).map((w) => (
              <WordCard key={w.id} word={w} />
            ))}
          </div>
        )}
      </div>

      {/* Recently added */}
      {recentWords.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recently added</h2>
            <button className="btn-text" onClick={() => navigate('/vocab')}>View all →</button>
          </div>
          <div className="word-grid word-grid-sm">
            {recentWords.map((w) => <WordCard key={w.id} word={w} />)}
          </div>
        </div>
      )}

      {/* Quick actions */}
      {words.length === 0 && (
        <EmptyState
          icon="📖"
          title="Welcome to WordWise!"
          description="Start by adding words you want to learn, or paste an article to explore."
          action={
            <div className="empty-actions">
              <Button onClick={() => navigate('/vocab/add')}>Add your first word</Button>
              <Button variant="secondary" onClick={() => navigate('/article')}>Try article reader</Button>
            </div>
          }
        />
      )}
    </div>
  );
}
