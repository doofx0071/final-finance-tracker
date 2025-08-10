import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle errors
  if (error) {
    console.error('Password reset error:', error, errorDescription)
    // Redirect to reset page with error
    const resetUrl = new URL('/reset', requestUrl.origin)
    resetUrl.searchParams.set('error', 'reset_error')
    if (errorDescription) {
      resetUrl.searchParams.set('error_description', errorDescription)
    }
    return NextResponse.redirect(resetUrl)
  }

  if (code && type === 'recovery') {
    try {
      const supabase = createRouteHandlerClient<Database>({ cookies })
      
      // Exchange the recovery code for a session
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('Session exchange error:', sessionError)
        // Redirect to reset page with error
        const resetUrl = new URL('/reset', requestUrl.origin)
        resetUrl.searchParams.set('error', 'session_error')
        return NextResponse.redirect(resetUrl)
      }
      
      // Successful authentication - redirect to reset page
      const resetUrl = new URL('/reset', requestUrl.origin)
      resetUrl.searchParams.set('success', 'true')
      return NextResponse.redirect(resetUrl)
    } catch (err) {
      console.error('Unexpected error in password reset callback:', err)
      // Redirect to reset page with generic error
      const resetUrl = new URL('/reset', requestUrl.origin)
      resetUrl.searchParams.set('error', 'unexpected_error')
      return NextResponse.redirect(resetUrl)
    }
  }

  // No code provided or wrong type - redirect to reset request page
  const resetRequestUrl = new URL('/reset-request', requestUrl.origin)
  resetRequestUrl.searchParams.set('error', 'invalid_link')
  return NextResponse.redirect(resetRequestUrl)
}
