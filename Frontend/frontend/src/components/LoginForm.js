import { useState } from 'react';
import './LoginForm.css';

export default function LoginForm({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Temporary simulation (no backend yet)
    if (username === 'admin' && password === 'password123') {
      const fakeToken = 'demo-token';
      localStorage.setItem('token', fakeToken);
      setToken(fakeToken);
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
