import { redirect } from 'next/navigation'
import { getServerClient } from '@/lib/supabase/server'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await getServerClient()
  
  // Check if user is already authenticated
  const { data: { session } } = await supabase.auth.getSession()
  
  // If user is already authenticated, redirect to dashboard
  if (session) {
    redirect('/dashboard')
  }

  return <>{children}</>
}
