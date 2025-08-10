'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { passwordResetSchema, type PasswordResetInput } from '@/lib/validation/auth'
import { mapAuthError } from '@/lib/utils/auth-errors'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Loader2, KeyRound } from 'lucide-react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<PasswordResetInput>>({})
  const [success, setSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(true)
  const [password, setPassword] = useState('')
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)
  
  useEffect(() => {
    // Check URL parameters for errors or success
    const urlError = searchParams.get('error')
    const urlSuccess = searchParams.get('success')
    const errorDescription = searchParams.get('error_description')
    
    if (urlError) {
      setIsValidToken(false)
      if (errorDescription) {
        setError(errorDescription)
      }
    } else if (urlSuccess) {
      // Check if we have a valid session from the email link
      const checkSession = async () => {
        const supabase = createBrowserClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setIsValidToken(false)
        }
      }
      
      checkSession()
    } else {
      // No parameters, likely direct access
      setIsValidToken(false)
    }
  }, [searchParams])
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    
    const formData = new FormData(e.currentTarget)
    const data = {
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }
    
    // Validate form data
    const result = passwordResetSchema.safeParse(data)
    if (!result.success) {
      const errors: Partial<PasswordResetInput> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as keyof PasswordResetInput] = issue.message
        }
      })
      setFieldErrors(errors)
      return
    }
    
    setIsLoading(true)
    
    try {
      const supabase = createBrowserClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password: result.data.password,
      })
      
      if (updateError) {
        const mappedError = mapAuthError(updateError)
        setError(mappedError.message)
        toast.error('Failed to reset password', {
          description: mappedError.message
        })
        return
      }
      
      setSuccess(true)
      
      // Show success toast
      toast.success('Password changed successfully', {
        description: 'Redirecting to dashboard...'
      })
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border">
              <XCircle className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4">Invalid or Expired Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired. Please request a new one.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link href="/reset-request">
              <Button>Request New Link</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4">Password Reset Successful!</CardTitle>
            <CardDescription>
              Your password has been changed. Redirecting to dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border">
            <KeyRound className="h-6 w-6" />
          </div>
          <CardTitle className="mt-4">Set Your New Password</CardTitle>
          <CardDescription>
            Please enter your new password below
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            <div>
              <FormField
                label="New Password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Enter new password"
                disabled={isLoading}
                error={fieldErrors.password}
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
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Confirm new password"
              disabled={isLoading}
              error={fieldErrors.confirmPassword}
            />
            
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
            <Link href="/login" className="text-sm text-muted-foreground hover:underline">
              Back to Sign In
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function ResetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
