import React, { useState } from 'react';
import { useAuthService } from '../../services/authService';
import { useAuthContext } from '../../context/authContext';
import { isAxiosError, ErrorResponse } from '../../utils/axiosUtils';
import { useNavigate } from 'react-router-dom';

export function VerifyEmailPage() {
  const { handleVerifyEmail, handleResendVerification } = useAuthService();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      setError('No user found in context. Please login or register first.');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await handleVerifyEmail(user.id, code);
      setMessage(data.message || 'Email verified successfully!');
      setTimeout(() => {
        navigate('/login'); 
      }, 2000);
    } catch (err: unknown) {
      if (isAxiosError<ErrorResponse>(err)) {
        setError(err.response?.data?.error || 'Verification failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    if (!user) {
      setError('No user found in context. Please login or register first.');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await handleResendVerification(user.id);
      setMessage(data.message || 'Verification code resent!');
    } catch (err: unknown) {
      if (isAxiosError<ErrorResponse>(err)) {
        setError(err.response?.data?.error || 'Failed to resend code');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Verify Email</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        <form onSubmit={onVerify} className="space-y-4">
          <div>
            <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              id="verification-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="Enter verification code"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          <div className="space-y-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            
            <button 
              type="button"
              onClick={onResend}
              disabled={loading}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Resend Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}