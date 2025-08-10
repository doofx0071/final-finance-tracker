import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { signOut } from '@/app/(protected)/actions/auth'

interface ServerHeaderProps {
  userName?: string | null
}

export default function ServerHeader({ userName }: ServerHeaderProps) {
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
          <form action={signOut}>
            <Button 
              type="submit"
              variant="outline"
            >
              Sign Out
            </Button>
          </form>
        </nav>
      </div>
    </header>
  )
}
