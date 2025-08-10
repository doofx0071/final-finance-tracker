import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, TrendingUp, Shield, Target, PiggyBank, BarChart3, Smartphone } from "lucide-react";
import { getServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await getServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">₱</span>
            <span className="text-xl font-semibold">Finance Tracker</span>
          </div>
          <nav className="flex items-center space-x-6">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Take Control of Your
              <span className="block mt-2">Financial Future</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern, Filipino-made personal finance tracker designed to help you manage expenses, 
              set budgets, and achieve your financial goals with PHP currency support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Start Free Today <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Free forever • No credit card required • {formatCurrency(0)} to start
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Manage Your Money
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-lg border flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Expense Tracking</h3>
              <p className="text-muted-foreground">
                Track every peso with smart categorization and real-time insights into your spending patterns.
              </p>
            </div>
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-lg border flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Budget Management</h3>
              <p className="text-muted-foreground">
                Set monthly budgets by category and get alerts when you're approaching your limits.
              </p>
            </div>
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-lg border flex items-center justify-center">
                <PiggyBank className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Savings Goals</h3>
              <p className="text-muted-foreground">
                Set and track financial goals with visual progress indicators and milestone celebrations.
              </p>
            </div>
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-lg border flex items-center justify-center">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Analytics & Reports</h3>
              <p className="text-muted-foreground">
                Get detailed insights with charts, trends, and comprehensive financial reports.
              </p>
            </div>
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-lg border flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Bank-Level Security</h3>
              <p className="text-muted-foreground">
                Your data is encrypted and protected with enterprise-grade security measures.
              </p>
            </div>
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-lg border flex items-center justify-center">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Mobile Responsive</h3>
              <p className="text-muted-foreground">
                Access your finances anywhere with our fully responsive design for all devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Start Your Financial Journey Today
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of Filipinos taking control of their finances
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">₱</span>
              <span className="text-lg font-semibold">Finance Tracker</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Finance Tracker. Filipino-made with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
