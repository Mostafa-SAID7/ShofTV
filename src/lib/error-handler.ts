/**
 * Centralized Error Handling
 * 
 * Maps HTTP status codes to user-friendly error messages.
 * Returns structured error objects for consistent error handling across the app.
 */

import { AxiosError } from 'axios';
import { ApiError } from '@/types/api';

/**
 * Handle API errors and return user-friendly error messages
 * 
 * @param error - Axios error object
 * @returns Structured API error object
 */
export function handleApiError(error: AxiosError): ApiError {
  // Default error message
  let message = 'An unexpected error occurred. Please try again.';
  let statusCode = 500;
  let details: any = null;

  if (error.response) {
    // Server responded with error status
    statusCode = error.response.status;
    details = error.response.data;

    // Map status codes to user-friendly messages
    switch (statusCode) {
      case 400:
        message = 'Invalid request. Please check your input.';
        // Try to extract more specific error message from response
        if (typeof details === 'string') {
          message = details;
        } else if (details?.message) {
          message = details.message;
        } else if (details?.errors) {
          // Handle validation errors
          const validationErrors = Object.values(details.errors).flat();
          message = validationErrors.join(', ');
        }
        break;

      case 401:
        message = 'Authentication required. Please login.';
        break;

      case 403:
        message = "You don't have permission to perform this action.";
        break;

      case 404:
        message = 'Resource not found.';
        if (typeof details === 'string') {
          message = details;
        } else if (details?.message) {
          message = details.message;
        }
        break;

      case 409:
        message = 'Conflict. This resource already exists.';
        if (typeof details === 'string') {
          message = details;
        } else if (details?.message) {
          message = details.message;
        }
        break;

      case 500:
        message = 'Server error. Please try again later.';
        break;

      case 503:
        message = 'Service temporarily unavailable. Please try again later.';
        break;

      default:
        message = `Error: ${statusCode}. Please try again.`;
    }
  } else if (error.request) {
    // Request was made but no response received
    message = 'Network error. Please check your connection and try again.';
    statusCode = 0;
  } else {
    // Something else happened
    message = error.message || 'An unexpected error occurred.';
  }

  return {
    message,
    statusCode,
    details,
  };
}

/**
 * Check if error is an API error
 */
export function isApiError(error: any): error is ApiError {
  return (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    'statusCode' in error
  );
}

/**
 * Get error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred.';
}
