// src/pages/VerifyEmailPage.tsx
import React, { useState } from 'react';
import { verifyEmail, resendVerification } from '../../api/authApi';

export function VerifyEmailPage() {
  // In a real app, retrieve userId from context, Redux, localStorage, or route param
  const [userId] = useState<number>(123); 
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!code.trim()) {
      setError('Code is required');
      return;
    }

    try {
      const data = await verifyEmail(userId, code);
      // e.g. { message: "Email verified successfully" }
      setMessage(data.message || 'Email verified!');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Verification failed');
    }
  }

  async function handleResend() {
    setError('');
    setMessage('');

    try {
      const data = await resendVerification(userId);
      // e.g. { message: "New verification code sent..." }
      setMessage(data.message || 'Verification code resent');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to resend code');
    }
  }

  return (
    <div className="verify-email-form">
      <h2>Verify your email</h2>
      <p>Enter the verification code sent to your email</p>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <form onSubmit={handleVerify}>
        <label>Verification Code</label>
        <input
          type="text"
          placeholder="Enter your 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button type="submit">
          {/* icon is optional */}
          <span role="img" aria-label="mail">✉️</span> Verify Email
        </button>
      </form>

      <button
        type="button"
        onClick={handleResend}
        style={{ marginTop: '1rem', opacity: 0.9 }}
      >
        {/* icon is optional */}
        <span role="img" aria-label="refresh">🔄</span> Resend Verification Code
      </button>
    </div>
  );
}
