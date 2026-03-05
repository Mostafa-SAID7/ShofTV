/**
 * Authentication API Service
 * 
 * Encapsulates all authentication-related API calls.
 * Handles login, registration, logout, and password management.
 */

import apiClient from '@/lib/api-client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types/api';

/**
 * Login user
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  const loginData: LoginRequest = {
    Username: username,
    Password: password,
  };

  const response = await apiClient.post<LoginResponse>('/api/account/login', loginData);
  
  // Store token in localStorage
  if (response.data.accessToken) {
    localStorage.setItem('authToken', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
}

/**
 * Register new user
 */
export async function register(userData: RegisterRequest): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>('/api/account/register', userData);
  return response.data;
}

/**
 * Logout user
 */
export async function logout(username: string): Promise<{ message: string; username: string }> {
  const response = await apiClient.post<{ message: string; username: string }>(
    '/api/account/logout',
    JSON.stringify(username),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  // Clear token from localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');

  return response.data;
}

/**
 * Request password reset
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
  const forgotPasswordData: ForgotPasswordRequest = {
    Email: email,
  };

  const response = await apiClient.post<{ message: string }>(
    '/api/account/forgotpassword',
    forgotPasswordData
  );

  return response.data;
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  const resetPasswordData: ResetPasswordRequest = {
    Token: token,
    NewPassword: newPassword,
  };

  const response = await apiClient.post<{ message: string }>(
    '/api/account/resetpassword',
    resetPasswordData
  );

  return response.data;
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Get current auth token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
