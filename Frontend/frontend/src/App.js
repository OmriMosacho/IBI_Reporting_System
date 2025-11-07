import { useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'analytics'

  if (!token) {
    return <LoginForm setToken={setToken} />;
  }

  return (
    <div className="app-container">
      <nav className="top-nav">
        <button
          className={view === 'dashboard' ? 'active' : ''}
          onClick={() => setView('dashboard')}
        >
          Raw Data
        </button>
        <button
          className={view === 'analytics' ? 'active' : ''}
          onClick={() => setView('analytics')}
        >
          Analytics Dashboard
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            setToken(null);
          }}
        >
          Logout
        </button>
      </nav>

      {view === 'dashboard' && <Dashboard token={token} setToken={setToken} />}
      {view === 'analytics' && <AnalyticsDashboard />}
    </div>
  );
}

export default App;
