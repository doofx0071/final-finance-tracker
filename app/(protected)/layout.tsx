import { redirect } from 'next/navigation'
import { getServerClient } from '@/lib/supabase/server'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await getServerClient()
  
  // Check if user is authenticated
  const { data: { session }, error } = await supabase.auth.getSession()
  
  // Log any session errors for debugging
  if (error) {
    console.error('Session error in protected layout:', error)
  }
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login')
  }
  
  // Double-check with getUser for extra security
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error('User verification failed:', userError)
    redirect('/login')
  }
  
  return (
    <>
      {children}
    </>
  )
}
