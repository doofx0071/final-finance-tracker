/**
 * Test script to verify OAuth configuration
 * Run this script to check if Google OAuth is properly configured
 */

const checkOAuthConfig = () => {
  console.log('OAuth Configuration Test');
  console.log('========================\n');

  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SITE_URL'
  ];

  let allConfigured = true;

  console.log('Environment Variables:');
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: Configured`);
    } else {
      console.log(`❌ ${varName}: Not configured`);
      allConfigured = false;
    }
  });

  console.log('\n');

  // Check callback URLs
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (siteUrl) {
    console.log('OAuth Callback URLs:');
    console.log(`Local: ${siteUrl}/auth/callback`);
    console.log('\nMake sure these URLs are configured in:');
    console.log('1. Google Cloud Console -> OAuth 2.0 Client -> Authorized redirect URIs');
    console.log('2. Supabase Dashboard -> Authentication -> Providers -> Google');
  }

  console.log('\n');

  // Summary
  if (allConfigured) {
    console.log('✅ All required environment variables are configured');
    console.log('\nNext steps:');
    console.log('1. Ensure Google OAuth is enabled in Supabase Dashboard');
    console.log('2. Add Google Client ID and Secret to Supabase');
    console.log('3. Configure redirect URLs in Google Cloud Console');
    console.log('4. Test login at: ' + (siteUrl || 'http://localhost:3000') + '/login');
  } else {
    console.log('⚠️  Some environment variables are missing');
    console.log('\nPlease configure all required variables in your .env.local file');
    console.log('Refer to .env.example for the template');
  }
};

// Load environment variables if running directly
if (require.main === module) {
  require('dotenv').config({ path: '.env.local' });
  checkOAuthConfig();
}

module.exports = checkOAuthConfig;
