import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabase/server'

// Support both form submissions and API calls
export async function POST() {
  const supabase = await getServerClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Sign out error:', error)
    // For API calls, return error response
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    )
  }
  
  // For form submissions, redirect to login
  redirect('/login')
}

// Support GET for direct navigation/links
export async function GET() {
  return POST()
}
