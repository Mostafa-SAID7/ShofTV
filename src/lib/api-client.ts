/**
 * API Client Configuration
 * 
 * Axios client configured to communicate with the MoviesAPI backend.
 * Includes request/response interceptors for authentication and error handling.
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { handleApiError } from './error-handler';

// Get API configuration from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7200';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10);

/**
 * Create Axios instance with base configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Attaches authentication token from localStorage to all requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors and authentication failures
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return successful response
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      // Clear token from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Redirect to login page (only if not already on login page)
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    
    // Handle other errors using centralized error handler
    const apiError = handleApiError(error);
    
    return Promise.reject(apiError);
  }
);

export default apiClient;
