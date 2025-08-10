'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { passwordResetRequestSchema, type PasswordResetRequestInput } from '@/lib/validation/auth'
import { mapAuthError } from '@/lib/utils/auth-errors'
import { toast } from 'sonner'
import { Mail, Loader2, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'

export default function ResetRequestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<PasswordResetRequestInput>>({})
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    
    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
    }
    
    // Validate form data
    const result = passwordResetRequestSchema.safeParse(data)
    if (!result.success) {
      const errors: Partial<PasswordResetRequestInput> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as keyof PasswordResetRequestInput] = issue.message
        }
      })
      setFieldErrors(errors)
      return
    }
    
    setIsLoading(true)
    
    try {
      const supabase = createBrowserClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        result.data.email,
        {
          redirectTo: `${window.location.origin}/auth/reset`,
        }
      )
      
      if (resetError) {
        const mappedError = mapAuthError(resetError)
        setError(mappedError.message)
        return
      }
      
      setSuccess(true)
      toast.success('Reset link sent!', {
        description: 'Please check your email for the password reset link.'
      })
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a password reset link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Please check your inbox and follow the instructions in the email to reset your password.
                The link will expire in 1 hour.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/login">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border">
            <Mail className="h-6 w-6" />
          </div>
          <CardTitle className="mt-4">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            <FormField
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              hint="We'll send a password reset link to this email"
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
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
            <Link href="/login" className="text-sm text-muted-foreground hover:underline">
              <ArrowLeft className="inline-block mr-1 h-3 w-3" />
              Back to Sign In
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
