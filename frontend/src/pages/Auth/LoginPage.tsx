// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { loginUser } from '../../api/authApi';
// Possibly import a global AuthContext or user store

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const data = await loginUser(email, password);
      setMessage(data.message);
      // data.user => store in global context if you want
      // e.g. setAuthUser(data.user)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to login.');
    }
  }

  return (
    <div className="auth-form">
      <h2>Welcome back</h2>
      <p>Enter your credentials to access your account</p>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          placeholder="me@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Sign In</button>
      </form>

      {/* Link to the "Forgot password?" page */}
      <a href="/forgot-password">Forgot your password?</a>
    </div>
  );
}
