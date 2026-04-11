import { useNavigate } from 'react-router-dom';
import { useWords } from '../hooks/useWords';
import { WordList } from '../components/word/WordList';
import { Button } from '../components/common/Button';

export function VocabListPage() {
  const { words } = useWords();
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Vocabulary</h1>
        <Button onClick={() => navigate('/vocab/add')}>+ Add Word</Button>
      </div>
      <WordList words={words} emptyMessage="Add words to start building your vocabulary." />
    </div>
  );
}
