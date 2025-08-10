import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'

/**
 * Creates a Supabase client for use in Client Components
 * This client automatically handles authentication state from cookies
 */
export function createBrowserClient() {
  return createClientComponentClient<Database>()
}
