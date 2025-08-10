'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createBrowserClient } from '@/lib/supabase/client'
import { useState } from 'react'

interface HeaderProps {
  userName?: string | null
}

export default function Header({ userName }: HeaderProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  
  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const supabase = createBrowserClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        setIsSigningOut(false)
        return
      }
      
      // Redirect to login page
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Unexpected sign out error:', error)
      setIsSigningOut(false)
    }
  }
  
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">₱</span>
            <span className="text-xl font-semibold">Finance Tracker</span>
          </div>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/transactions">
            <Button variant="ghost">Transactions</Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost">
              {userName || 'Profile'}
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </Button>
        </nav>
      </div>
    </header>
  )
}
