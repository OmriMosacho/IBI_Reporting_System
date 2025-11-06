import { useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <div className="app-container">
      {!token ? (
        <LoginForm setToken={setToken} />
      ) : (
        <Dashboard token={token} setToken={setToken} />
      )}
    </div>
  );
}

export default App;
