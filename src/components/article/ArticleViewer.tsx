import { useState } from 'react';
import type { Article } from '../../types';
import { useWords } from '../../hooks/useWords';
import { WordSelectPopover } from './WordSelectPopover';

interface ArticleViewerProps {
  article: Article;
  onWordAdded?: (word: string) => void;
}

interface Token {
  text: string;
  isWord: boolean;
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  // Split on whitespace and punctuation, keeping punctuation as tokens
  const parts = text.split(/(\s+|[.,!?;:()[\]{}"'—–\-]+)/);
  for (const part of parts) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      tokens.push({ text: part, isWord: false });
    } else if (/^[a-zA-Z]+$/.test(part)) {
      tokens.push({ text: part, isWord: true });
    } else {
      tokens.push({ text: part, isWord: false });
    }
  }
  return tokens;
}

interface PopoverState {
  word: string;
  rect: DOMRect;
}

export function ArticleViewer({ article, onWordAdded }: ArticleViewerProps) {
  const { wordExists } = useWords();
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set(
    article.savedWordIds.map((id) => id.toLowerCase())
  ));

  const tokens = tokenize(article.body);

  function handleWordClick(word: string, e: React.MouseEvent) {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPopover({ word: word.toLowerCase(), rect });
  }

  function handleWordAdded(word: string) {
    setSavedWords((prev) => new Set([...prev, word]));
    onWordAdded?.(word);
  }

  return (
    <div className="article-viewer">
      <h2 className="article-title">{article.title}</h2>
      {article.source && (
        <p className="article-source">Source: {article.source}</p>
      )}

      <div className="article-body">
        {tokens.map((token, i) => {
          if (!token.isWord) return <span key={i}>{token.text}</span>;
          const lower = token.text.toLowerCase();
          const isSaved = savedWords.has(lower) || wordExists(lower);
          return (
            <span
              key={i}
              className={`article-word ${isSaved ? 'article-word-saved' : 'article-word-clickable'}`}
              onClick={(e) => handleWordClick(token.text, e)}
              title={isSaved ? 'Already in vocabulary' : 'Click to add to vocabulary'}
            >
              {token.text}
            </span>
          );
        })}
      </div>

      <p className="article-tip">
        Click any word to add it to your vocabulary.
        <span className="article-tip-saved">Underlined words</span> are already saved.
      </p>

      {popover && (
        <WordSelectPopover
          word={popover.word}
          sourceTitle={article.title}
          sourceUrl={article.source}
          anchorRect={popover.rect}
          onClose={() => setPopover(null)}
          onAdded={handleWordAdded}
        />
      )}
    </div>
  );
}
