/**
 * Maps Supabase auth error codes and messages to user-friendly messages
 */

import { AuthError } from '@supabase/supabase-js'

export type AuthErrorType = 
  | 'email_exists'
  | 'invalid_credentials'
  | 'weak_password'
  | 'email_not_confirmed'
  | 'expired_link'
  | 'invalid_link'
  | 'rate_limit'
  | 'network_error'
  | 'unknown'

export interface MappedAuthError {
  type: AuthErrorType
  message: string
  field?: 'email' | 'password' | 'confirmPassword'
}

/**
 * Map Supabase auth errors to user-friendly messages
 */
export function mapAuthError(error: AuthError | Error | string | null): MappedAuthError {
  if (!error) {
    return {
      type: 'unknown',
      message: 'An unexpected error occurred. Please try again.'
    }
  }

  const errorMessage = typeof error === 'string' 
    ? error 
    : 'message' in error 
      ? error.message 
      : 'An unexpected error occurred'

  const errorCode = typeof error === 'object' && 'code' in error 
    ? (error as any).code 
    : null

  // Check for specific error codes
  if (errorCode) {
    switch (errorCode) {
      case 'user_already_exists':
        return {
          type: 'email_exists',
          message: 'An account with this email already exists. Please sign in or use a different email.',
          field: 'email'
        }
      
      case 'invalid_credentials':
        return {
          type: 'invalid_credentials',
          message: 'Invalid email or password. Please check your credentials and try again.'
        }
      
      case 'email_not_confirmed':
        return {
          type: 'email_not_confirmed',
          message: 'Please verify your email address before signing in. Check your inbox for the verification link.'
        }
      
      case 'otp_expired':
      case 'link_expired':
        return {
          type: 'expired_link',
          message: 'This link has expired. Please request a new one.'
        }
      
      case 'invalid_otp':
      case 'invalid_link':
        return {
          type: 'invalid_link',
          message: 'This link is invalid. Please request a new one.'
        }
      
      case 'over_request_rate_limit':
      case 'rate_limit_exceeded':
        return {
          type: 'rate_limit',
          message: 'Too many attempts. Please wait a few minutes before trying again.'
        }
      
      case 'weak_password':
        return {
          type: 'weak_password',
          message: 'Password is too weak. Please use at least 8 characters with uppercase, lowercase, number, and special character.',
          field: 'password'
        }
    }
  }

  // Check error message patterns
  const lowerMessage = errorMessage.toLowerCase()

  if (lowerMessage.includes('user already registered') || 
      lowerMessage.includes('already exists') ||
      lowerMessage.includes('user_already_exists')) {
    return {
      type: 'email_exists',
      message: 'An account with this email already exists. Please sign in or use a different email.',
      field: 'email'
    }
  }

  if (lowerMessage.includes('invalid login') || 
      lowerMessage.includes('invalid password') ||
      lowerMessage.includes('invalid email') ||
      lowerMessage.includes('invalid credentials')) {
    return {
      type: 'invalid_credentials',
      message: 'Invalid email or password. Please check your credentials and try again.'
    }
  }

  if (lowerMessage.includes('email not confirmed') ||
      lowerMessage.includes('email_not_confirmed') ||
      lowerMessage.includes('confirm your email')) {
    return {
      type: 'email_not_confirmed',
      message: 'Please verify your email address before signing in. Check your inbox for the verification link.'
    }
  }

  if (lowerMessage.includes('weak password') ||
      lowerMessage.includes('password should be at least')) {
    return {
      type: 'weak_password',
      message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
      field: 'password'
    }
  }

  if (lowerMessage.includes('expired') ||
      lowerMessage.includes('token has expired')) {
    return {
      type: 'expired_link',
      message: 'This link has expired. Please request a new one.'
    }
  }

  if (lowerMessage.includes('invalid token') ||
      lowerMessage.includes('invalid link')) {
    return {
      type: 'invalid_link',
      message: 'This link is invalid. Please request a new one.'
    }
  }

  if (lowerMessage.includes('rate limit') ||
      lowerMessage.includes('too many requests')) {
    return {
      type: 'rate_limit',
      message: 'Too many attempts. Please wait a few minutes before trying again.'
    }
  }

  if (lowerMessage.includes('network') ||
      lowerMessage.includes('fetch')) {
    return {
      type: 'network_error',
      message: 'Network error. Please check your internet connection and try again.'
    }
  }

  // Default error
  return {
    type: 'unknown',
    message: 'An unexpected error occurred. Please try again later.'
  }
}

/**
 * Get a user-friendly error message from any error type
 */
export function getAuthErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred'
  
  if (typeof error === 'string') return error
  
  if (error instanceof Error) {
    return mapAuthError(error).message
  }
  
  if (typeof error === 'object' && 'message' in error) {
    return mapAuthError(error as Error).message
  }
  
  return 'An unexpected error occurred'
}
