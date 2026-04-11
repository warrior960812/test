import { useNavigate } from 'react-router-dom';
import { useWords } from '../hooks/useWords';
import { WordForm } from '../components/word/WordForm';

export function AddWordPage() {
  const { addWord } = useWords();
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Add Word</h1>
      </div>
      <div className="page-content-narrow">
        <WordForm
          onSubmit={(data) => {
            addWord(data);
            navigate('/vocab');
          }}
          onCancel={() => navigate('/vocab')}
          submitLabel="Add to vocabulary"
        />
      </div>
    </div>
  );
}
