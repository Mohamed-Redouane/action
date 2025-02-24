import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isAxiosError, ErrorResponse } from '../utils/axiosUtils';
import { getCurrentUser, logoutUser } from '../api/authApi';

export interface User {
  id: number;
  email: string;
  username: string;
  emailVerified: boolean;
}

interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  loading: true,
  logout: async () => {},
  refetchUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
  
    const fetchCurrentUser = useCallback(async () => {

        if (!isAuthenticating) return null;
  
      try {
        const response = await getCurrentUser();
        console.log('Fetched user data:', response);
        setUser(response.user);
        return response.user;
      } catch (error: unknown) {
        if (isAxiosError<ErrorResponse>(error)) {
          console.error('Auth fetch error:', error.response?.data?.error || 'Unknown authentication error.');

          if (error.response?.status === 401) {
            setIsAuthenticating(false);
          }
        } else if (error instanceof Error) {
          console.error('Auth fetch error:', error.message);
        } else {
          console.error('Unknown error occurred while fetching user.');
        }
        setUser(null);
        return null;
      }
    }, [isAuthenticating]); 
  
    useEffect(() => {
      const initializeAuth = async () => {
        try {
          await fetchCurrentUser();
        } finally {
          setLoading(false);
        }
      };
  
      if (isAuthenticating) {
        initializeAuth();
      }
    }, [fetchCurrentUser, isAuthenticating]);
  
    const logout = useCallback(async () => {
      try {
        await logoutUser();
      } catch (error: unknown) {
        console.error('Logout error:', error);
      } finally {
        setUser(null);
        setIsAuthenticating(false); 
      }
    }, []);
  

    const resetAuth = useCallback(() => {
      setIsAuthenticating(true);
    }, []);
  
    return (
      <AuthContext.Provider 
        value={{ 
          user, 
          setUser, 
          loading, 
          logout,
          refetchUser: () => {
            resetAuth(); 
            return fetchCurrentUser();
          }
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

export function useAuthContext() {
  return useContext(AuthContext);
}