import { useRef, useEffect } from 'react';
import { WordForm } from '../word/WordForm';
import { useWords } from '../../hooks/useWords';

interface WordSelectPopoverProps {
  word: string;
  sourceTitle?: string;
  sourceUrl?: string;
  onClose: () => void;
  onAdded?: (wordId: string) => void;
  anchorRect: DOMRect;
}

export function WordSelectPopover({ word, sourceTitle, sourceUrl, onClose, onAdded, anchorRect }: WordSelectPopoverProps) {
  const { addWord, wordExists, getWordByText } = useWords();
  const ref = useRef<HTMLDivElement>(null);
  const exists = wordExists(word);
  const existing = getWordByText(word);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Position below the anchor word
  const style: React.CSSProperties = {
    position: 'fixed',
    top: anchorRect.bottom + 8,
    left: Math.min(anchorRect.left, window.innerWidth - 360),
    zIndex: 1000,
    width: 340,
  };

  if (exists && existing) {
    return (
      <div ref={ref} className="popover" style={style}>
        <div className="popover-header">
          <strong>{existing.word}</strong>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <p className="popover-def">{existing.definition}</p>
        <p className="popover-saved">Already in your vocabulary ✓</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="popover" style={style}>
      <div className="popover-header">
        <strong>Add "{word}"</strong>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
      <WordForm
        compact
        initial={{ word, sourceArticleTitle: sourceTitle, sourceArticleUrl: sourceUrl }}
        onSubmit={(data) => {
          addWord(data);
          onAdded?.(data.word.toLowerCase().trim());
          onClose();
        }}
        onCancel={onClose}
        submitLabel="Add to vocabulary"
      />
    </div>
  );
}
