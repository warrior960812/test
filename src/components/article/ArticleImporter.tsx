import { useState } from 'react';
import type { Article } from '../../types';
import { SAMPLE_ARTICLES } from '../../data/sampleArticles';
import { Button } from '../common/Button';

interface ArticleImporterProps {
  onImport: (article: Article) => void;
}

export function ArticleImporter({ onImport }: ArticleImporterProps) {
  const [tab, setTab] = useState<'paste' | 'sample'>('paste');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedSample, setSelectedSample] = useState('');

  function handlePasteSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const article: Article = {
      id: crypto.randomUUID(),
      title: title.trim() || 'Untitled article',
      body: body.trim(),
      importedAt: new Date().toISOString(),
      savedWordIds: [],
    };
    onImport(article);
  }

  function handleSampleLoad() {
    const found = SAMPLE_ARTICLES.find((a) => a.id === selectedSample);
    if (found) onImport({ ...found, id: crypto.randomUUID(), importedAt: new Date().toISOString() });
  }

  return (
    <div className="article-importer">
      <div className="tab-bar">
        <button className={`tab-btn ${tab === 'paste' ? 'active' : ''}`} onClick={() => setTab('paste')}>
          Paste Article
        </button>
        <button className={`tab-btn ${tab === 'sample' ? 'active' : ''}`} onClick={() => setTab('sample')}>
          Sample Articles ({SAMPLE_ARTICLES.length})
        </button>
      </div>

      {tab === 'paste' && (
        <form className="importer-form" onSubmit={handlePasteSubmit}>
          <div className="form-group">
            <label className="form-label">Article title (optional)</label>
            <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My article" />
          </div>
          <div className="form-group">
            <label className="form-label">Article text *</label>
            <textarea
              className="form-input form-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Paste the article text here..."
              rows={8}
            />
          </div>
          <Button type="submit" disabled={!body.trim()}>Read Article</Button>
        </form>
      )}

      {tab === 'sample' && (
        <div className="sample-picker">
          <p className="sample-desc">Choose from AP News headlines to practice reading and saving words.</p>
          <div className="form-group">
            <label className="form-label">Select an article</label>
            <select
              className="form-input"
              value={selectedSample}
              onChange={(e) => setSelectedSample(e.target.value)}
            >
              <option value="">-- Choose an article --</option>
              {SAMPLE_ARTICLES.map((a) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleSampleLoad} disabled={!selectedSample}>Load Article</Button>
        </div>
      )}
    </div>
  );
}
