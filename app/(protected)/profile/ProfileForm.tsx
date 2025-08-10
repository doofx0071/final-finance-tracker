'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { FormError } from '@/components/ui/FormError'
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validation/auth'
import { updateProfile } from './actions'

interface ProfileFormProps {
  userId: string
  userEmail: string
  initialFirstName: string
  initialLastName: string
}

export default function ProfileForm({ 
  userId, 
  userEmail, 
  initialFirstName, 
  initialLastName 
}: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<UpdateProfileInput>>({})
  
  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setSuccess(null)
    setFieldErrors({})
    
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
    }
    
    // Client-side validation
    const result = updateProfileSchema.safeParse(data)
    if (!result.success) {
      const errors: Partial<UpdateProfileInput> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as keyof UpdateProfileInput] = issue.message
        }
      })
      setFieldErrors(errors)
      return
    }
    
    startTransition(async () => {
      const response = await updateProfile(userId, result.data.firstName, result.data.lastName)
      
      if (response.error) {
        setError(response.error)
      } else {
        setSuccess('Profile updated successfully!')
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000)
      }
    })
  }
  
  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            defaultValue={initialFirstName}
            required
            className="mt-1"
            error={!!fieldErrors.firstName}
            disabled={isPending}
          />
          <FormError error={fieldErrors.firstName} />
        </div>
        
        <div>
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            defaultValue={initialLastName}
            required
            className="mt-1"
            error={!!fieldErrors.lastName}
            disabled={isPending}
          />
          <FormError error={fieldErrors.lastName} />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={userEmail}
          className="mt-1"
          disabled
          readOnly
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Email cannot be changed from this page
        </p>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <FormError error={error} />
        </div>
      )}
      
      {success && (
        <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            {success}
          </p>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button type="submit" loading={isPending}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}
