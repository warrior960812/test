import { useState } from 'react';
import type { Word } from '../../types';
import { WordCard } from './WordCard';
import { EmptyState } from '../common/EmptyState';

interface WordListProps {
  words: Word[];
  emptyMessage?: string;
  onWordClick?: (word: Word) => void;
}

const MASTERY_OPTIONS = [
  { value: '', label: 'All levels' },
  { value: '0', label: 'New' },
  { value: '1', label: 'Learning' },
  { value: '2', label: 'Familiar' },
  { value: '3', label: 'Known' },
  { value: '4', label: 'Mastered' },
];

export function WordList({ words, emptyMessage, onWordClick }: WordListProps) {
  const [search, setSearch] = useState('');
  const [masteryFilter, setMasteryFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const allTags = Array.from(new Set(words.flatMap((w) => w.tags))).sort();

  const filtered = words.filter((w) => {
    if (search && !w.word.includes(search.toLowerCase()) && !w.definition.toLowerCase().includes(search.toLowerCase())) return false;
    if (masteryFilter !== '' && w.masteryLevel !== Number(masteryFilter)) return false;
    if (tagFilter && !w.tags.includes(tagFilter)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => a.word.localeCompare(b.word));

  return (
    <div className="word-list-container">
      <div className="word-list-filters">
        <input
          className="form-input filter-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search words or definitions..."
        />
        <select className="form-input filter-select" value={masteryFilter} onChange={(e) => setMasteryFilter(e.target.value)}>
          {MASTERY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {allTags.length > 0 && (
          <select className="form-input filter-select" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
            <option value="">All tags</option>
            {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
      </div>

      <p className="word-list-count">{sorted.length} word{sorted.length !== 1 ? 's' : ''}</p>

      {sorted.length === 0 ? (
        <EmptyState
          icon="🔍"
          title={search || masteryFilter || tagFilter ? 'No matches' : 'No words yet'}
          description={emptyMessage ?? 'Add your first word to get started.'}
        />
      ) : (
        <div className="word-grid">
          {sorted.map((w) => (
            <WordCard key={w.id} word={w} onClick={onWordClick ? () => onWordClick(w) : undefined} />
          ))}
        </div>
      )}
    </div>
  );
}
