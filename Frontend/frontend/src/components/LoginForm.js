/**
 * @file LoginForm.js
 * @module components/LoginForm
 * @description
 * Login and registration component with password visibility toggle and confirm password check.
 */

import { useState } from 'react';
import { api } from '../ApiRequest';
import './LoginForm.css';

export default function LoginForm({ setToken }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  /** Handle input field changes */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** Handle submit for login or register */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check for password mismatch when registering
    if (isRegistering && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      if (isRegistering) {
        const res = await api.post('users', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        alert(`User ${res.username || formData.username} registered successfully!`);
        setIsRegistering(false);
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      } else {
        const res = await api.post('login', {
          email: formData.email,
          password: formData.password,
        });
        if (res.token) {
          localStorage.setItem('token', res.token);
          setToken(res.token);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Invalid credentials or server error.');
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>

      <form onSubmit={handleSubmit} className="login-form">
        {isRegistering && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="show-password-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {isRegistering && (
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit" className="btn-primary">
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <p className="toggle-text">
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          className="link-button"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Login here' : 'Register here'}
        </button>
      </p>
    </div>
  );
}
