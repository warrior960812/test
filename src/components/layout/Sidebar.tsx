import { NavLink } from 'react-router-dom';
import { useWords } from '../../hooks/useWords';
import { getDueWords } from '../../hooks/useSpacedRepetition';

export function Sidebar() {
  const { words, settings, dispatch } = useWords();
  const dueCount = getDueWords(words).length;

  function toggleTheme() {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { theme: settings.theme === 'light' ? 'dark' : 'light' } });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">W</span>
        <span className="sidebar-name">WordWise</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🏠</span> Dashboard
          {dueCount > 0 && <span className="nav-badge">{dueCount}</span>}
        </NavLink>
        <NavLink to="/vocab" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📚</span> Vocabulary
          <span className="nav-count">{words.length}</span>
        </NavLink>
        <NavLink to="/vocab/add" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">➕</span> Add Word
        </NavLink>
        <NavLink to="/article" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📰</span> Article Reader
        </NavLink>
        <NavLink to="/quiz" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🧠</span> Quiz
          {dueCount > 0 && <span className="nav-badge">{dueCount}</span>}
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {settings.theme === 'light' ? '🌙' : '☀️'} {settings.theme === 'light' ? 'Dark' : 'Light'} mode
        </button>
      </div>
    </aside>
  );
}
