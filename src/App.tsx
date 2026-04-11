import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WordProvider } from './store/WordContext';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { VocabListPage } from './pages/VocabListPage';
import { AddWordPage } from './pages/AddWordPage';
import { WordDetailPage } from './pages/WordDetailPage';
import { ArticlePage } from './pages/ArticlePage';
import { QuizPage } from './pages/QuizPage';

export default function App() {
  return (
    <WordProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/vocab" element={<VocabListPage />} />
            <Route path="/vocab/add" element={<AddWordPage />} />
            <Route path="/vocab/:id" element={<WordDetailPage />} />
            <Route path="/article" element={<ArticlePage />} />
            <Route path="/quiz" element={<QuizPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WordProvider>
  );
}
