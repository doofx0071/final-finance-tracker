import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/database.types'

/**
 * Creates a Supabase client for use in Middleware
 * This client automatically handles authentication state from cookies
 * 
 * Example usage in middleware.ts:
 * 
 * import { getMiddlewareClient } from '@/lib/supabase/middleware'
 * 
 * export async function middleware(req: NextRequest) {
 *   const res = NextResponse.next()
 *   const supabase = getMiddlewareClient(req, res)
 *   
 *   const { data: { session } } = await supabase.auth.getSession()
 *   
 *   // Your middleware logic here
 *   
 *   return res
 * }
 */
export function getMiddlewareClient(req: NextRequest, res: NextResponse) {
  return createMiddlewareClient<Database>({ req, res }, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  })
}
