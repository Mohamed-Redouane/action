
import {
    registerUser,
    loginUser,
    logoutUser,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerification,
  } from '../api'; 
  import { useAuthContext } from '../context/authContext';
  
  export function useAuthService() {
    const { setUser } = useAuthContext();
  
    async function handleRegister(
      username: string,
      email: string,
      password: string
    ) {
      const data = await registerUser(username, email, password);

      setUser(data.user);
      return data;
    }
  
    async function handleLogin(email: string, password: string) {
      const data = await loginUser(email, password);
      setUser(data.user);
      return data;
    }
  
    async function handleLogout() {
      await logoutUser();
      setUser(null);
    }
  
    async function handleRequestPasswordReset(email: string) {
      return await requestPasswordReset(email);
    }
  
    async function handleResetPassword(code: string, newPassword: string) {
      return await resetPassword(code, newPassword);
    }
  
    async function handleVerifyEmail(userId: number, code: string) {
      return await verifyEmail(userId, code);
    }
  
    async function handleResendVerification(userId: number) {
      return await resendVerification(userId);
    }
  
    return {
      handleRegister,
      handleLogin,
      handleLogout,
      handleRequestPasswordReset,
      handleResetPassword,
      handleVerifyEmail,
      handleResendVerification,
    };
  }
  