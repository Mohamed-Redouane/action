import { useAuthContext } from '../context/authContext';

export function useAuth() {
  const { user, setUser } = useAuthContext();
  

  const isLoggedIn = !!user;

  return {
    user,
    setUser,
    isLoggedIn,
  };
}
