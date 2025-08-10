import { redirect } from 'next/navigation'
import { getServerClient } from '@/lib/supabase/server'
import ProfileForm from './ProfileForm'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function ProfilePage() {
  const supabase = await getServerClient()
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login')
  }
  
  // Fetch profile from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .eq('id', user.id)
    .single()
  
  // If no profile exists, create one with default values
  let profileData = profile
  if (profileError && profileError.code === 'PGRST116') {
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
      })
      .select()
      .single()
    
    profileData = newProfile
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Personal Information
              </h2>
              
              <ProfileForm 
                userId={user.id}
                userEmail={user.email || ''}
                initialFirstName={profileData?.first_name || ''}
                initialLastName={profileData?.last_name || ''}
              />
            </div>
          </div>
          
          {/* Account Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Account Actions
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Account ID
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                    {user.id}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Email
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Created
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <hr className="my-4 border-gray-200 dark:border-gray-700" />
                
                <form action="/api/auth/signout" method="POST">
                  <Button
                    type="submit"
                    variant="destructive"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
