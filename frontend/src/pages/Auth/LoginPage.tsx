import { useState } from 'react';
import { useAuthService } from '../../services/authService';
import { LoginForm } from '../../Components/Auth/LoginForm';
import { useNavigate } from 'react-router-dom';
import { isAxiosError, ErrorResponse } from '../../utils/axiosUtils'; 

export function LoginPage() {
  const { handleLogin } = useAuthService();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(email: string, password: string) {
    setError('');
    setLoading(true);
    try {
      await handleLogin(email, password);
      navigate('/');
    } catch (err: unknown) {
      if (isAxiosError<ErrorResponse>(err)) {
        setError(err.response?.data?.error || 'Login failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  return <LoginForm onSubmit={onSubmit} error={error} isLoading={loading} />;
}