import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/transactions',
  '/profile',
  '/settings',
  '/analytics',
  '/budgets',
  '/goals',
] as const

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/reset-request',
  '/reset',
  '/auth/callback',
  '/auth/error',
  '/auth/verify-email',
] as const

// Define paths that should be completely exempt from middleware
const EXEMPT_PATHS = [
  '/_next',
  '/api/public',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
  '/images',
  '/fonts',
  '/static',
] as const

/**
 * Middleware to handle authentication and session management
 * - Refreshes session on each request to keep cookies up to date
 * - Protects routes that require authentication
 * - Redirects unauthenticated users to login page
 */
export async function middleware(request: NextRequest) {
  // Create a response object that can be modified
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Get the pathname from the request URL
  const { pathname } = request.nextUrl

  // Check if the path should be exempt from middleware processing
  const isExemptPath = EXEMPT_PATHS.some(path => pathname.startsWith(path))
  if (isExemptPath) {
    return response
  }

  try {
    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient<Database>(
      { req: request, res: response },
      {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      }
    )

    // Refresh session to keep it active and update auth cookies
    // This will also validate the session and return null if invalid
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    // Log any session refresh errors (but don't block the request)
    if (error) {
      console.error('Session refresh error:', error.message)
    }

    // Check if the current route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname.startsWith(route)
    )

    // Check if the current route is public
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    )

    // If the route is protected and there's no valid session, redirect to login
    if (isProtectedRoute && !session) {
      // Store the attempted URL to redirect back after login
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('next', pathname)
      
      return NextResponse.redirect(redirectUrl)
    }

    // If the user is logged in and trying to access auth pages (except callback), 
    // redirect to dashboard
    if (session && isPublicRoute && !pathname.includes('/auth/callback')) {
      const authPages = ['/login', '/register', '/reset-request', '/reset']
      if (authPages.some(page => pathname.startsWith(page))) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Return the response with updated cookies
    return response
  } catch (error) {
    // Log any unexpected errors
    console.error('Middleware error:', error)
    
    // In case of error, allow the request to continue
    // This prevents the middleware from blocking the entire app
    return response
  }
}

/**
 * Configure which routes the middleware should run on
 * This uses Next.js's built-in path matching
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - .well-known (for various web standards)
     * - Static file extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf|map|pdf|doc|docx|xls|xlsx|csv|txt|json|xml)$).*)',
  ],
}
