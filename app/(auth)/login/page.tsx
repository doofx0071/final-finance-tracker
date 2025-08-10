'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { loginSchema, type LoginInput } from '@/lib/validation/auth'
import { mapAuthError } from '@/lib/utils/auth-errors'
import { Alert, AlertDescription } from '@/components/ui/alert'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<LoginInput>>({})
  
  // Handle OAuth callback errors
  useEffect(() => {
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (errorParam) {
      let errorMessage = 'Authentication failed. '
      
      switch (errorParam) {
        case 'oauth_error':
          errorMessage += errorDescription || 'OAuth provider error occurred.'
          break
        case 'session_error':
          errorMessage += 'Failed to create session. Please try again.'
          break
        case 'no_code':
          errorMessage += 'No authorization code received.'
          break
        case 'unexpected_error':
          errorMessage += 'An unexpected error occurred.'
          break
        default:
          errorMessage += 'Please try again.'
      }
      
      setError(errorMessage)
      
      // Clean up URL
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('error')
      newUrl.searchParams.delete('error_description')
      window.history.replaceState({}, '', newUrl.toString())
    }
  }, [searchParams])
  
  const handleGoogleSignIn = async () => {
    setError(null)
    setIsOAuthLoading(true)
    
    try {
      const supabase = createBrowserClient()
      
      // Get the redirect URL based on environment
      const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        : `${window.location.origin}/auth/callback`
      
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      
      if (oauthError) {
        setError('Failed to sign in with Google. Please try again.')
        console.error('OAuth error:', oauthError)
      }
      // If successful, the browser will redirect to the OAuth provider
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Google sign-in error:', err)
    } finally {
      setIsOAuthLoading(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    
    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
    
    // Validate form data
    const result = loginSchema.safeParse(data)
    if (!result.success) {
      const errors: Partial<LoginInput> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as keyof LoginInput] = issue.message
        }
      })
      setFieldErrors(errors)
      return
    }
    
    setIsLoading(true)
    
    try {
      const supabase = createBrowserClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      })
      
      if (signInError) {
        // Map the error to a user-friendly message
        const mappedError = mapAuthError(signInError)
        setError(mappedError.message)
        
        // If error is field-specific, add it to field errors
        if (mappedError.field) {
          setFieldErrors({ [mappedError.field]: mappedError.message })
        }
        return
      }
      
      // Redirect to the next URL or dashboard
      router.push(next)
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <FormField
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              error={fieldErrors.email}
              disabled={isLoading || isOAuthLoading}
              placeholder="Enter your email"
            />
            
            <FormField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              error={fieldErrors.password}
              disabled={isLoading || isOAuthLoading}
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/reset-request" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isOAuthLoading}
          >
            Sign in
          </Button>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              loading={isOAuthLoading}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {isOAuthLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>}>
      <LoginForm />
    </Suspense>
  )
}
