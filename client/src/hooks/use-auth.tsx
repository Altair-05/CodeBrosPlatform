import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@shared/types'; // Assuming User type is available from shared schema

interface AuthContextType {
  currentUserId: number | null; // Changed from string to number
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize currentUserId from localStorage if available, parsing as number
  const [currentUserId, setCurrentUserId] = useState<number | null>(() => {
    const storedId = localStorage.getItem('currentUserId');
    return storedId ? parseInt(storedId, 10) : null;
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const isAuthenticated = !!currentUserId;

  useEffect(() => {
    // On component mount, if a userId exists in localStorage,
    // we might want to validate it with the backend if needed,
    // but for now, we'll just set isLoadingAuth to false.
    // In a real app, this would involve token validation or a session check.
    setIsLoadingAuth(false); 
  }, []);

  useEffect(() => {
    // Persist currentUserId to localStorage whenever it changes
    if (currentUserId !== null) {
      localStorage.setItem('currentUserId', currentUserId.toString());
    } else {
      localStorage.removeItem('currentUserId');
    }
  }, [currentUserId]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoadingAuth(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // The backend returns the full user object, we use the ID directly as number
        const user: User = await response.json();
        setCurrentUserId(user.id); // No need for toString(), use the number directly
        return true;
      } else {
        // Handle specific error messages from backend if any
        const errorData = await response.json().catch(() => ({ message: 'Login failed.' }));
        console.error('Login error:', errorData.message);
        return false;
      }
    } catch (error) {
      console.error('Network or unexpected login error:', error);
      return false;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = () => {
    setCurrentUserId(null);
    // In a real app, you might also hit a /api/auth/logout endpoint
  };

  const value = {
    currentUserId,
    isAuthenticated,
    login,
    logout,
    isLoadingAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}