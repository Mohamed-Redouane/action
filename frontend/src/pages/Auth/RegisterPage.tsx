import { useState } from 'react';
import { useAuthService } from '../../services/authService';
import { RegisterForm } from '../../Components/Auth/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { isAxiosError, ErrorResponse } from '../../utils/axiosUtils';

export function RegisterPage() {
  const { handleRegister } = useAuthService();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setSuccessMsg] = useState('');

  async function onSubmit(username: string, email: string, password: string) {
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const data = await handleRegister(username, email, password);
      setSuccessMsg(data.message || 'Registration successful!');
      navigate('/verify-email');
    } catch (err: unknown) {
      if (isAxiosError<ErrorResponse>(err)) {
        setError(err.response?.data?.error || 'Registration failed');
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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <RegisterForm onSubmit={onSubmit} error={error} isLoading={loading} />
    </div>
  );
}