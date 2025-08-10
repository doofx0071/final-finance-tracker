# Finance Tracker

A modern finance tracking application built with Next.js 14, TypeScript, and Supabase for authentication and database management.

## Features

- 🔐 **Secure Authentication** with Supabase (Email/Password and Google OAuth)
- 👤 **User Profile Management** with customizable profiles
- 🛡️ **Protected Routes** with middleware-based authentication
- 📱 **Responsive Design** with Tailwind CSS and shadcn/ui components
- 🔄 **Real-time Updates** with Supabase real-time subscriptions
- 📊 **Financial Tracking** features (transactions, budgets, goals)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Authentication:** Supabase Auth
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + shadcn/ui
- **Form Handling:** React Hook Form + Zod validation
- **State Management:** React Context + Hooks

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or later
- npm, yarn, pnpm, or bun package manager
- A Supabase account (free tier available at [supabase.com](https://supabase.com))

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd finance-tracker
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set Up Supabase

1. Create a new project on [Supabase](https://app.supabase.com)
2. Navigate to Project Settings > API
3. Copy your project URL and anon key
4. (Optional) Set up Google OAuth:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL to `http://localhost:3000/auth/callback` (development)

### 4. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Update `.env.local` with your Supabase credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Environment Variables Explained:**
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key (safe for client-side)
- `NEXT_PUBLIC_SITE_URL`: Your application URL (used for redirects and OAuth callbacks)

### 5. Set Up Database Tables

Run the following SQL in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS Policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Authentication Flows

### Email/Password Authentication

1. **Registration**: Users can sign up at `/register` with email and password
2. **Login**: Users can sign in at `/login` with their credentials
3. **Password Reset**: Users can request password reset at `/reset-request`

### Google OAuth

1. Users can sign in with Google from the login page
2. After authentication, users are redirected to `/auth/callback`
3. The callback handler creates/updates the user profile and redirects to dashboard

### Protected Routes

The application uses Next.js middleware to protect routes:

- **Public Routes**: `/`, `/login`, `/register`, `/reset-request`, `/reset`
- **Protected Routes**: `/dashboard`, `/profile`, `/transactions`, `/budgets`, `/goals`
- **Auth Routes**: Accessible only when not authenticated

## Project Structure

```
finance-tracker/
├── app/
│   ├── (auth)/              # Authentication pages (public)
│   │   ├── login/
│   │   ├── register/
│   │   └── reset-request/
│   ├── (protected)/         # Protected pages (requires auth)
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── actions/
│   ├── api/                 # API routes
│   │   └── auth/
│   └── auth/                # Auth callback handlers
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── auth/                # Auth-specific components
├── lib/
│   ├── supabase/           # Supabase client configurations
│   ├── validation/         # Zod schemas
│   └── utils/              # Utility functions
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
└── middleware.ts           # Next.js middleware for auth
```

## Key Features Implementation

### Profile Management

Users can update their profile information including:
- Full name
- Avatar (via URL or upload)
- Email preferences
- Account settings

### Middleware Authentication

The `middleware.ts` file handles:
- Session validation
- Route protection
- Automatic redirects
- Token refresh

### Form Validation

All forms use Zod schemas for validation:
- Client-side validation with React Hook Form
- Server-side validation in API routes
- Type-safe form data handling

## Configuration Notes

### Supabase URL Configuration

⚠️ **Important**: When setting up OAuth providers in Supabase:

1. **Redirect URLs**: Add your site URL to the redirect allowlist:
   - Development: `http://localhost:3000/**`
   - Production: `https://your-domain.com/**`

2. **Site URL**: Set in Authentication > URL Configuration:
   - This should match your `NEXT_PUBLIC_SITE_URL`

3. **OAuth Callback**: The callback URL pattern is:
   - `{NEXT_PUBLIC_SITE_URL}/auth/callback`

### Google OAuth Setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret to Supabase Auth Providers

## Development

### Running Tests

```bash
npm run test
# or
yarn test
```

### Building for Production

```bash
npm run build
# or
yarn build
```

### Linting

```bash
npm run lint
# or
yarn lint
```

## Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Remember to update these for production:
- `NEXT_PUBLIC_SITE_URL`: Your production domain
- Update Supabase redirect URLs to include your production domain

## Troubleshooting

### Common Issues

1. **"Invalid Refresh Token" Error**
   - Clear browser cookies
   - Check Supabase JWT expiry settings

2. **OAuth Redirect Issues**
   - Verify redirect URLs in Supabase dashboard
   - Ensure `NEXT_PUBLIC_SITE_URL` is correct

3. **Profile Not Creating**
   - Check database triggers are set up
   - Verify RLS policies are correct

4. **Middleware Not Working**
   - Ensure middleware.ts is in the root directory
   - Check matcher patterns in middleware config

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [Supabase](https://supabase.com) - Open source Firebase alternative
- [shadcn/ui](https://ui.shadcn.com) - Beautifully designed components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
