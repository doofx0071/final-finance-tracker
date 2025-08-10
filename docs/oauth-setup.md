# Google OAuth Setup Guide

This guide walks you through setting up Google OAuth authentication for the Finance Tracker application.

## Prerequisites

- A Supabase project
- A Google Cloud Platform account
- Access to Google Cloud Console

## Step 1: Configure Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen first:
   - Choose **External** for user type
   - Fill in the required application information
   - Add your email to test users if in development
6. For Application type, select **Web application**
7. Configure the authorized redirect URIs:
   - For local development: `http://localhost:3000/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`
8. Copy your **Client ID** and **Client Secret**

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find and enable **Google**
5. Enter your Google OAuth credentials:
   - Client ID (from Google Cloud Console)
   - Client Secret (from Google Cloud Console)
6. Configure the redirect URL in Supabase (should match what you set in Google):
   - Default: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
7. Save the configuration

## Step 3: Configure Environment Variables

Update your `.env.local` file with the following:

```env
# Required Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site URL for OAuth callbacks
# For local development:
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# For production (replace with your domain):
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Step 4: Test the Implementation

### Local Testing

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Navigate to http://localhost:3000/login
3. Click "Sign in with Google"
4. Authenticate with your Google account
5. You should be redirected to the dashboard upon successful authentication

### Production Testing

1. Deploy your application
2. Ensure `NEXT_PUBLIC_SITE_URL` is set to your production domain
3. Update Google OAuth redirect URIs to include your production URL
4. Test the login flow on your production domain

## Troubleshooting

### Common Issues and Solutions

#### "Redirect URI mismatch" error
- Ensure the redirect URI in Google Cloud Console exactly matches your callback URL
- Check that `NEXT_PUBLIC_SITE_URL` is correctly set
- Verify the URL includes `/auth/callback` at the end

#### OAuth callback returns to login with error
- Check the browser console for detailed error messages
- Verify Supabase OAuth settings are correctly configured
- Ensure Google OAuth app is not in test mode if using production

#### Session not persisting after login
- Check that cookies are enabled in the browser
- Verify Supabase client is correctly initialized
- Ensure the auth callback route is properly exchanging the code for a session

## Security Considerations

1. **Never commit credentials**: Keep your `.env.local` file in `.gitignore`
2. **Use HTTPS in production**: OAuth requires secure connections
3. **Restrict redirect URIs**: Only add necessary URLs to prevent redirect attacks
4. **Review OAuth scopes**: Only request necessary permissions
5. **Monitor usage**: Regularly review OAuth app usage in Google Cloud Console

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication Best Practices](https://nextjs.org/docs/authentication)
