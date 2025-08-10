'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator'
import { registerSchema, type RegisterInput } from '@/lib/validation/auth'
import { mapAuthError } from '@/lib/utils/auth-errors'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<RegisterInput>>({})
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState('')
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    
    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
    }
    
    // Validate form data
    const result = registerSchema.safeParse(data)
    if (!result.success) {
      const errors: Partial<RegisterInput> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as keyof RegisterInput] = issue.message
        }
      })
      setFieldErrors(errors)
      return
    }
    
    setIsLoading(true)
    
    try {
      const supabase = createBrowserClient()
      
      // Get the site URL for email redirect
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                      process.env.NEXT_PUBLIC_APP_URL || 
                      window.location.origin
      
      const { error: signUpError } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          data: {
            first_name: result.data.firstName,
            last_name: result.data.lastName,
          },
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      })
      
      if (signUpError) {
        // Map the error to a user-friendly message
        const mappedError = mapAuthError(signUpError)
        setError(mappedError.message)
        
        // If error is field-specific, add it to field errors
        if (mappedError.field) {
          setFieldErrors({ [mappedError.field]: mappedError.message })
        }
        return
      }
      
      setSuccess(true)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Registration successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please check your email to verify your account.
            </p>
            <div className="mt-6">
              <Link href="/login">
                <Button>Go to Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="First name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                error={fieldErrors.firstName}
                disabled={isLoading}
                placeholder="John"
              />
              
              <FormField
                label="Last name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                error={fieldErrors.lastName}
                disabled={isLoading}
                placeholder="Doe"
              />
            </div>
            
            <FormField
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              error={fieldErrors.email}
              disabled={isLoading}
              placeholder="john.doe@example.com"
              hint="We'll send a verification email to this address"
            />
            
            <div>
              <FormField
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                error={fieldErrors.password}
                disabled={isLoading}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordStrength(true)}
              />
              {showPasswordStrength && (
                <div className="mt-3">
                  <PasswordStrengthIndicator password={password} />
                </div>
              )}
            </div>
            
            <FormField
              label="Confirm password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              error={fieldErrors.confirmPassword}
              disabled={isLoading}
              placeholder="Re-enter your password"
            />
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
          >
            Create account
          </Button>
        </form>
      </div>
    </div>
  )
}
