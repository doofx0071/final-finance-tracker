# Route Protection & Authentication

## Overview
This application implements comprehensive route protection using multiple layers of security:

1. **Middleware-level protection** - Prevents unauthenticated access at the edge
2. **Layout-level protection** - Server-side session verification for protected routes
3. **Page-level protection** - Individual page checks for extra security

## Implementation Details

### 1. Middleware Protection (`middleware.ts`)
- Runs on every request before reaching the application
- Checks session validity using Supabase cookies
- Redirects unauthenticated users to `/login` when accessing protected routes
- Preserves the attempted URL for post-login redirection
- Protected routes include:
  - `/dashboard`
  - `/transactions`
  - `/profile`
  - `/settings`
  - `/analytics`
  - `/budgets`
  - `/goals`

### 2. Protected Layout (`app/(protected)/layout.tsx`)
- Server-side session verification using `getServerClient()`
- Double-checks authentication with both `getSession()` and `getUser()`
- Redirects to `/login` if authentication fails
- Provides an extra layer of security for all protected pages

### 3. Sign Out Implementation

#### Client-Side Sign Out (`components/layout/Header.tsx`)
- Uses `createBrowserClient()` for client-side Supabase interaction
- Calls `supabase.auth.signOut()` to clear the session
- Redirects to `/login` after successful sign out
- Shows loading state during sign out process

#### Server-Side Sign Out (`components/layout/ServerHeader.tsx`)
- Uses server action for sign out
- Form-based approach for progressive enhancement
- Works without JavaScript enabled

#### API Route (`app/api/auth/signout/route.ts`)
- Supports both POST and GET methods
- Server-side session clearing
- Redirects to `/login` after sign out
- Used by the profile page sign out button

#### Server Action (`app/(protected)/actions/auth.ts`)
- Alternative server-side sign out method
- Can be used with form submissions
- Provides error handling and logging

## Usage

### Adding Sign Out to a Component

#### Client Component:
```tsx
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const handleSignOut = async () => {
  const supabase = createBrowserClient()
  const { error } = await supabase.auth.signOut()
  if (!error) {
    router.push('/login')
  }
}
```

#### Server Component:
```tsx
import { signOut } from '@/app/(protected)/actions/auth'

<form action={signOut}>
  <button type="submit">Sign Out</button>
</form>
```

### Protected Page Example:
```tsx
import { redirect } from 'next/navigation'
import { getServerClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
  const supabase = await getServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Page content here
}
```

## Security Features

1. **Cookie-based Session Management**: Sessions are stored in httpOnly cookies for security
2. **Server-side Validation**: All protected routes validate sessions on the server
3. **Middleware Protection**: Requests are intercepted before reaching the application
4. **Double Verification**: Both session and user checks in the protected layout
5. **Graceful Error Handling**: Errors are logged but don't block the application
6. **Session Refresh**: Middleware automatically refreshes sessions to keep them active

## File Structure

```
app/
├── (protected)/
│   ├── layout.tsx          # Protected route layout with session checks
│   ├── dashboard/
│   ├── profile/
│   ├── transactions/
│   └── actions/
│       └── auth.ts         # Server actions for authentication
├── api/
│   └── auth/
│       └── signout/
│           └── route.ts    # API route for sign out
components/
├── layout/
│   ├── Header.tsx          # Client component with sign out
│   └── ServerHeader.tsx    # Server component with sign out
middleware.ts               # Edge middleware for route protection
```

## Testing Route Protection

1. **Unauthenticated Access Test**:
   - Clear cookies/local storage
   - Try to access `/dashboard`
   - Should redirect to `/login`

2. **Sign Out Test**:
   - Sign in to the application
   - Click the Sign Out button
   - Should redirect to `/login`
   - Try to access `/dashboard` again
   - Should remain on `/login`

3. **Session Expiry Test**:
   - Sign in and wait for session to expire
   - Try to navigate to a protected page
   - Should redirect to `/login`

## Troubleshooting

### Common Issues:

1. **Redirect Loop**:
   - Check that public routes are properly excluded in middleware
   - Ensure `/login` is not in the protected routes list

2. **Session Not Persisting**:
   - Verify Supabase environment variables are set
   - Check cookie settings in Supabase client configuration

3. **Sign Out Not Working**:
   - Ensure the Supabase client is properly initialized
   - Check browser console for errors
   - Verify the redirect URL is correct

## Best Practices

1. Always use server-side session checks for sensitive operations
2. Implement loading states during authentication operations
3. Log authentication errors for debugging
4. Use the protected layout for all authenticated pages
5. Keep the middleware lean for performance
6. Test with different authentication states
