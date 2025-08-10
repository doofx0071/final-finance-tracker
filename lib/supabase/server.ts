import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'

/**
 * Creates a Supabase client for use in Server Components
 * This client automatically handles authentication state from cookies
 * Must be used in async Server Components
 */
export async function getServerClient() {
  return createServerComponentClient<Database>({
    cookies,
  })
}
