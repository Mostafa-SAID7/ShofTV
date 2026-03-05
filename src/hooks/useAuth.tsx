/**
 * Authentication Context and Hooks
 * 
 * Provides authentication state management and hooks for login, logout, and registration.
 * Uses React Context to share auth state across the application.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as authService from '@/services/auth.service';
import { BackendUser, RegisterRequest } from '@/types/api';

interface AuthContextType {
  user: BackendUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = authService.getAuthToken();
    const storedUser = authService.getCurrentUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authService.login(username, password),
    onSuccess: (data) => {
      setToken(data.accessToken);
      setUser(data.user);
      toast.success('Login successful!', {
        description: `Welcome back, ${data.user.Name}!`,
      });
    },
    onError: (error: any) => {
      toast.error('Login failed', {
        description: error.message || 'Invalid username or password.',
      });
      throw error;
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: (username: string) => authService.logout(username),
    onSuccess: () => {
      setToken(null);
      setUser(null);
      queryClient.clear(); // Clear all cached data
      toast.success('Logged out successfully!');
    },
    onError: (error: any) => {
      // Still clear local state even if API call fails
      setToken(null);
      setUser(null);
      queryClient.clear();
      toast.error('Logout error', {
        description: error.message || 'An error occurred during logout.',
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: (data) => {
      toast.success('Registration successful!', {
        description: data.message || 'Please check your email to confirm your account.',
      });
    },
    onError: (error: any) => {
      toast.error('Registration failed', {
        description: error.message || 'An error occurred during registration.',
      });
      throw error;
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const logout = async () => {
    if (user) {
      await logoutMutation.mutateAsync(user.Username);
    }
  };

  const register = async (userData: RegisterRequest) => {
    await registerMutation.mutateAsync(userData);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    register,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending || registerMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook for login mutation (alternative to useAuth().login)
 */
export function useLogin() {
  const { login } = useAuth();
  return { login };
}

/**
 * Hook for logout mutation (alternative to useAuth().logout)
 */
export function useLogout() {
  const { logout } = useAuth();
  return { logout };
}

/**
 * Hook for register mutation (alternative to useAuth().register)
 */
export function useRegister() {
  const { register } = useAuth();
  return { register };
}
