import { redirect } from 'next/navigation'
import { getServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function TransactionsPage() {
  const supabase = await getServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single()
  
  return (
    <div className="min-h-screen bg-background">
      <Header userName={profile?.first_name} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Track all your income and expenses</p>
        </div>
        
        {/* Placeholder content */}
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <h2 className="text-xl font-semibold mb-2">No transactions yet</h2>
          <p className="text-muted-foreground mb-4">
            Start tracking your finances by adding your first transaction
          </p>
          <Button>Add Transaction</Button>
        </div>
      </main>
    </div>
  )
}
