'use server'

import { revalidatePath } from 'next/cache'
import { getServerClient } from '@/lib/supabase/server'
import { updateProfileSchema } from '@/lib/validation/auth'

export async function updateProfile(
  userId: string,
  firstName: string,
  lastName: string
) {
  try {
    // Server-side validation
    const validationResult = updateProfileSchema.safeParse({
      firstName,
      lastName,
    })
    
    if (!validationResult.success) {
      return { error: 'Invalid form data' }
    }
    
    const supabase = await getServerClient()
    
    // Verify the user is updating their own profile
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || user.id !== userId) {
      return { error: 'Unauthorized' }
    }
    
    // Update the profile in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: validationResult.data.firstName,
        last_name: validationResult.data.lastName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
    
    if (profileError) {
      console.error('Profile update error:', profileError)
      return { error: 'Failed to update profile' }
    }
    
    // Optionally update user metadata to keep it in sync
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        first_name: validationResult.data.firstName,
        last_name: validationResult.data.lastName,
      }
    })
    
    if (authError) {
      console.error('Auth metadata update error:', authError)
      // Not a critical error, profile was still updated
    }
    
    // Revalidate the profile page to reflect changes
    revalidatePath('/profile')
    
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'An unexpected error occurred' }
  }
}
