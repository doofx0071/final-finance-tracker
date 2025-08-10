import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth callback error:', error, errorDescription)
    // Redirect to login with error message
    const loginUrl = new URL('/login', requestUrl.origin)
    loginUrl.searchParams.set('error', 'oauth_error')
    if (errorDescription) {
      loginUrl.searchParams.set('error_description', errorDescription)
    }
    return NextResponse.redirect(loginUrl)
  }

  if (code) {
    try {
      const supabase = createRouteHandlerClient<Database>({ cookies })
      
      // Exchange the auth code for a session
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('Session exchange error:', sessionError)
        // Redirect to login with error
        const loginUrl = new URL('/login', requestUrl.origin)
        loginUrl.searchParams.set('error', 'session_error')
        return NextResponse.redirect(loginUrl)
      }
      
      // Successful authentication - redirect to dashboard or next URL
      const redirectUrl = new URL(next, requestUrl.origin)
      return NextResponse.redirect(redirectUrl)
    } catch (err) {
      console.error('Unexpected error in auth callback:', err)
      // Redirect to login with generic error
      const loginUrl = new URL('/login', requestUrl.origin)
      loginUrl.searchParams.set('error', 'unexpected_error')
      return NextResponse.redirect(loginUrl)
    }
  }

  // No code provided - redirect to login
  const loginUrl = new URL('/login', requestUrl.origin)
  loginUrl.searchParams.set('error', 'no_code')
  return NextResponse.redirect(loginUrl)
}
