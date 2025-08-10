import { redirect } from 'next/navigation'
import { getServerClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { BarChart, LineChart, PieChart } from '@/components/ui/Charts'
import Header from '@/components/layout/Header'

export default async function DashboardPage() {
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

  // Dummy data for charts
  const monthlySummary = [
    { name: 'Jan', income: 4000, expenses: 2400 },
    { name: 'Feb', income: 3000, expenses: 1398 },
    { name: 'Mar', income: 5000, expenses: 6800 },
    { name: 'Apr', income: 2780, expenses: 3908 },
    { name: 'May', income: 1890, expenses: 4800 },
    { name: 'Jun', income: 2390, expenses: 3800 },
  ]

  const categorySpending = [
    { name: 'Food', value: 400 },
    { name: 'Transport', value: 300 },
    { name: 'Utilities', value: 200 },
    { name: 'Entertainment', value: 278 },
    { name: 'Other', value: 189 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header userName={profile?.first_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {profile?.first_name}!</h1>
          <p className="text-muted-foreground">Here is your financial overview.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium text-muted-foreground">Net Worth</h3>
            <p className="text-3xl font-bold">{formatCurrency(125300)}</p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium text-muted-foreground">This Month's Income</h3>
            <p className="text-3xl font-bold text-green-500">{formatCurrency(12500)}</p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium text-muted-foreground">This Month's Expenses</h3>
            <p className="text-3xl font-bold text-red-500">{formatCurrency(7800)}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Monthly Summary</h3>
            <div className="h-80">
              <BarChart data={monthlySummary} xKey="name" yKeys={['income', 'expenses']} />
            </div>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Spending by Category</h3>
            <div className="h-80">
              <PieChart data={categorySpending} nameKey="name" dataKey="value" />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
            <Link href="/transactions">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          {/* Placeholder for transactions list */}
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No transactions yet. Add one to get started!</p>
            <Link href="/transactions/new">
              <Button className="mt-4">Add Transaction</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
