import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

type WordInput = {
  word: string;
  definition: string;
  examples: string[];
  notes: string;
  tags: string[];
  sourceArticleTitle?: string;
  sourceArticleUrl?: string;
};

interface WordFormProps {
  initial?: Partial<WordInput>;
  onSubmit: (data: WordInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
  compact?: boolean;
}

export function WordForm({ initial, onSubmit, onCancel, submitLabel = 'Save', compact = false }: WordFormProps) {
  const [word, setWord] = useState(initial?.word ?? '');
  const [definition, setDefinition] = useState(initial?.definition ?? '');
  const [examples, setExamples] = useState<string[]>(initial?.examples ?? ['']);
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  function addExample() {
    setExamples([...examples, '']);
  }

  function updateExample(i: number, val: string) {
    const next = [...examples];
    next[i] = val;
    setExamples(next);
  }

  function removeExample(i: number) {
    setExamples(examples.filter((_, idx) => idx !== i));
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput('');
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!word.trim()) { setError('Word is required'); return; }
    if (!definition.trim()) { setError('Definition is required'); return; }
    setError('');
    onSubmit({
      word: word.trim(),
      definition: definition.trim(),
      examples: examples.map((ex) => ex.trim()).filter(Boolean),
      notes: notes.trim(),
      tags,
      sourceArticleTitle: initial?.sourceArticleTitle,
      sourceArticleUrl: initial?.sourceArticleUrl,
    });
  }

  return (
    <form className={`word-form ${compact ? 'word-form-compact' : ''}`} onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label className="form-label">Word *</label>
        <input
          className="form-input"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="e.g. ephemeral"
          autoFocus={!compact}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Definition *</label>
        <textarea
          className="form-input form-textarea"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          placeholder="What does it mean?"
          rows={compact ? 2 : 3}
        />
      </div>

      {!compact && (
        <>
          <div className="form-group">
            <label className="form-label">Example sentences</label>
            {examples.map((ex, i) => (
              <div key={i} className="example-row">
                <input
                  className="form-input"
                  value={ex}
                  onChange={(e) => updateExample(i, e.target.value)}
                  placeholder={`Example ${i + 1}`}
                />
                {examples.length > 1 && (
                  <button type="button" className="btn-icon" onClick={() => removeExample(i)} title="Remove">×</button>
                )}
              </div>
            ))}
            <button type="button" className="btn-text" onClick={addExample}>+ Add example</button>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-input form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Your personal notes, mnemonics, related words..."
              rows={2}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="tag-input-row">
              <input
                className="form-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                placeholder="Type a tag and press Enter"
              />
            </div>
            {tags.length > 0 && (
              <div className="tag-list">
                {tags.map((t) => (
                  <Badge key={t} label={t} onRemove={() => setTags(tags.filter((x) => x !== t))} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="form-actions">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
