# Middleware Setup for Authentication

## Overview
The middleware implementation provides session management and route protection for the Finance Tracker application using Supabase Auth.

## Features

### 1. Session Refresh
- Automatically refreshes the user session on each request
- Keeps authentication cookies up to date
- Prevents session expiration during active use

### 2. Route Protection
Protected routes that require authentication:
- `/dashboard` - Main dashboard and all subpaths
- `/transactions` - Transaction management and all subpaths
- `/profile` - User profile and all subpaths
- `/settings` - Application settings
- `/analytics` - Financial analytics
- `/budgets` - Budget management
- `/goals` - Financial goals

### 3. Public Routes
Routes accessible without authentication:
- `/` - Home page
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/auth/callback` - OAuth callback handler
- `/auth/error` - Error page
- `/auth/reset-password` - Password reset
- `/auth/verify-email` - Email verification

### 4. Exempt Paths
Paths completely exempt from middleware processing:
- `/_next/*` - Next.js internal files
- `/api/public/*` - Public API routes
- Static assets (images, fonts, etc.)
- Service files (favicon, robots.txt, sitemap.xml, etc.)

## How It Works

1. **Session Management**: On every request, the middleware creates a Supabase client and attempts to refresh the session from cookies.

2. **Route Protection**: 
   - If accessing a protected route without a valid session → Redirect to `/auth/signin` with return URL
   - If authenticated and accessing auth pages → Redirect to `/dashboard`
   - Public routes are accessible to everyone

3. **Error Handling**: If any error occurs during middleware execution, the request continues to prevent blocking the entire application.

## Configuration

### Environment Variables
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### Path Matcher
The middleware uses Next.js's built-in path matching to run on all routes except:
- Static files (`_next/static`, `_next/image`)
- File extensions (`.svg`, `.png`, `.jpg`, etc.)
- Public assets

## Testing the Middleware

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test protected routes**:
   - Navigate to `/dashboard` without authentication
   - Should redirect to `/auth/signin?next=/dashboard`

3. **Test public routes**:
   - Navigate to `/` or `/auth/signin`
   - Should be accessible without authentication

4. **Test authenticated flow**:
   - Sign in with valid credentials
   - Should redirect to `/dashboard`
   - Auth pages should redirect to dashboard when already authenticated

## File Structure
```
finance-tracker/
├── middleware.ts           # Main middleware file
├── app/
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx   # Sign in page
│   │   └── callback/
│   │       └── route.ts   # OAuth callback handler
│   ├── dashboard/
│   │   └── page.tsx       # Protected dashboard page
│   └── page.tsx           # Public home page
└── lib/
    └── supabase/
        └── middleware.ts   # Supabase middleware client helper
```

## Security Considerations

1. **Cookie-based Sessions**: The middleware uses httpOnly cookies for session management, providing better security than localStorage.

2. **Session Validation**: Every request validates the session with Supabase, ensuring expired or invalid sessions are caught immediately.

3. **Redirect URL Preservation**: When redirecting to login, the original URL is preserved to redirect back after successful authentication.

4. **Error Resilience**: Middleware errors don't block the application, preventing DoS scenarios from auth service issues.

## Troubleshooting

### Middleware not running
- Check that `middleware.ts` is in the project root
- Verify the matcher configuration in the middleware
- Check console for compilation errors

### Session not persisting
- Ensure cookies are enabled in the browser
- Check Supabase project settings for correct domain configuration
- Verify environment variables are set correctly

### Redirect loops
- Check that auth routes are properly excluded from protection
- Verify the session check logic
- Ensure callback routes are accessible

### Assets blocked
- Add file extensions to the matcher exclusion pattern
- Add paths to EXEMPT_PATHS array
- Check that static file paths are correctly configured
