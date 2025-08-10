import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'

/**
 * Creates a Supabase client for use in Route Handlers
 * This client automatically handles authentication state from cookies
 * Must be used in async Route Handlers
 */
export async function getRouteClient() {
  return createRouteHandlerClient<Database>({
    cookies,
  })
}
