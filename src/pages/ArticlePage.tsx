import { useState } from 'react';
import type { Article } from '../types';
import { useWords } from '../hooks/useWords';
import { ArticleImporter } from '../components/article/ArticleImporter';
import { ArticleViewer } from '../components/article/ArticleViewer';
import { Button } from '../components/common/Button';

export function ArticlePage() {
  const { dispatch } = useWords();
  const [article, setArticle] = useState<Article | null>(null);

  function handleImport(a: Article) {
    dispatch({ type: 'IMPORT_ARTICLE', payload: a });
    setArticle(a);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Article Reader</h1>
        {article && (
          <Button variant="secondary" onClick={() => setArticle(null)}>
            ← New article
          </Button>
        )}
      </div>

      {!article ? (
        <ArticleImporter onImport={handleImport} />
      ) : (
        <ArticleViewer article={article} />
      )}
    </div>
  );
}
