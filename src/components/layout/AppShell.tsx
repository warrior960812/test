import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useWords } from '../../hooks/useWords';

export function AppShell() {
  const { settings } = useWords();

  return (
    <div className="app-shell" data-theme={settings.theme}>
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
