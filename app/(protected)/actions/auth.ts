'use server'

import { redirect } from 'next/navigation'
import { getServerClient } from '@/lib/supabase/server'

export async function signOut() {
  const supabase = await getServerClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Sign out error:', error)
    throw new Error('Failed to sign out')
  }
  
  // Clear any server-side session data
  // and redirect to login page
  redirect('/login')
}
