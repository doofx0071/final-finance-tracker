/**
 * Simple test script to verify middleware behavior
 * Run with: node test-middleware.js
 * Make sure the dev server is running first: npm run dev
 */

const baseUrl = 'http://localhost:3000';

async function testRoute(path, expectedBehavior) {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      redirect: 'manual', // Don't follow redirects automatically
    });
    
    const status = response.status;
    const location = response.headers.get('location');
    
    console.log(`✓ ${path}:`);
    console.log(`  Status: ${status}`);
    if (location) {
      console.log(`  Redirects to: ${location}`);
    }
    console.log(`  Expected: ${expectedBehavior}`);
    console.log('');
    
    return { path, status, location };
  } catch (error) {
    console.log(`✗ ${path}: Error - ${error.message}`);
    console.log('');
    return { path, error: error.message };
  }
}

async function runTests() {
  console.log('Testing Middleware Behavior');
  console.log('============================\n');
  
  console.log('1. Testing Public Routes (Should be accessible):');
  console.log('-------------------------------------------------');
  await testRoute('/', 'Status 200 - Public page accessible');
  await testRoute('/auth/signin', 'Status 200 - Auth page accessible');
  
  console.log('2. Testing Protected Routes (Should redirect to signin):');
  console.log('--------------------------------------------------------');
  await testRoute('/dashboard', 'Status 307/308 - Redirect to /auth/signin?next=/dashboard');
  await testRoute('/transactions', 'Status 307/308 - Redirect to /auth/signin?next=/transactions');
  await testRoute('/profile', 'Status 307/308 - Redirect to /auth/signin?next=/profile');
  
  console.log('3. Testing API Routes (Should be accessible):');
  console.log('---------------------------------------------');
  await testRoute('/api/health', 'Status 200 - API endpoint accessible');
  
  console.log('4. Testing Static Assets (Should be accessible):');
  console.log('------------------------------------------------');
  await testRoute('/favicon.ico', 'Status 200/404 - Static file request');
}

// Check if server is running
fetch(baseUrl)
  .then(() => {
    console.log('Server is running at', baseUrl);
    console.log('');
    runTests();
  })
  .catch(() => {
    console.error('Error: Development server is not running!');
    console.error('Please start the server first with: npm run dev');
    process.exit(1);
  });
