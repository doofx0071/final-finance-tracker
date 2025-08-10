# Testing Documentation

## Overview

This project includes comprehensive testing for the authentication system, covering unit tests for validation schemas and end-to-end tests for user flows.

## Testing Stack

- **Unit Testing**: Jest + Testing Library
- **E2E Testing**: Playwright
- **Coverage Reporting**: Jest Coverage

## Quick Start

### Install Dependencies
```bash
npm install
npx playwright install  # Install browsers for E2E tests
```

### Run Tests

#### Unit Tests
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

#### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI (interactive mode)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test registration.spec.ts
```

## Test Structure

```
finance-tracker/
├── lib/
│   └── validation/
│       ├── auth.ts           # Validation schemas
│       └── auth.test.ts      # Unit tests for schemas
├── e2e/
│   ├── registration.spec.ts  # Registration flow tests
│   ├── login.spec.ts         # Login flow tests
│   ├── password-reset.spec.ts # Password reset tests
│   └── protected-routes.spec.ts # Protected routes tests
├── jest.config.js            # Jest configuration
├── jest.setup.js             # Jest setup file
├── playwright.config.ts      # Playwright configuration
└── TESTING_CHECKLIST.md     # Manual testing checklist
```

## Test Coverage

### Unit Test Coverage

The unit tests cover all validation schemas:

- ✅ Login validation
- ✅ Registration validation
- ✅ Password reset request validation
- ✅ Password reset validation
- ✅ Profile update validation

Each schema is tested for:
- Valid inputs
- Required field validation
- Format validation
- Business rule validation
- Edge cases

### E2E Test Coverage

#### Registration Flow
- Form display and field presence
- Required field validation
- Email format validation
- Password strength requirements
- Password confirmation matching
- Successful registration
- Duplicate email handling
- Navigation links

#### Login Flow
- Form display
- Field validation
- Invalid credentials handling
- Successful login
- Already authenticated redirect
- OAuth options
- Password visibility toggle
- Navigation links

#### Password Reset
- Reset request form
- Email validation
- Reset link handling
- Token validation
- New password validation
- Complete flow testing
- Invalid/expired tokens

#### Protected Routes
- Unauthenticated access blocking
- Authenticated access
- Profile management
- Session persistence
- Sign out functionality
- Navigation between protected pages

## Running Tests in CI/CD

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Environment Setup for Testing

### Test Database

For E2E tests, you'll need a test database. Options:

1. **Local Supabase** (Recommended for development)
```bash
npx supabase init
npx supabase start
```

2. **Separate Test Project** on Supabase
- Create a separate project for testing
- Use test environment variables

### Environment Variables

Create `.env.test.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_test_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_test_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Test Data Management

### Seed Data

Create test users before running E2E tests:

```sql
-- Insert test user
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES 
  ('test@example.com', crypt('TestPassword123!', gen_salt('bf')), now());

-- Insert profile
INSERT INTO public.profiles (id, first_name, last_name)
SELECT id, 'Test', 'User' 
FROM auth.users 
WHERE email = 'test@example.com';
```

### Cleanup

After tests, clean up test data:

```sql
DELETE FROM auth.users WHERE email LIKE 'test%@example.com';
```

## Debugging Tests

### Unit Tests

Debug in VS Code:
1. Add breakpoint in test file
2. Run "Jest: Debug" from command palette
3. Or add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### E2E Tests

Debug Playwright tests:
```bash
# Run in debug mode
npx playwright test --debug

# Run with UI mode for step-by-step debugging
npx playwright test --ui

# Generate trace for failed tests
npx playwright test --trace on
```

View trace:
```bash
npx playwright show-trace trace.zip
```

## Best Practices

### Writing Unit Tests

1. **Test one thing at a time**
   - Each test should verify a single behavior
   - Use descriptive test names

2. **Use AAA pattern**
   - Arrange: Set up test data
   - Act: Execute the function
   - Assert: Verify the result

3. **Test edge cases**
   - Empty inputs
   - Maximum/minimum values
   - Invalid formats

### Writing E2E Tests

1. **Use data attributes for selectors**
   ```tsx
   // In component
   <button data-testid="submit-button">Submit</button>
   
   // In test
   await page.locator('[data-testid="submit-button"]').click()
   ```

2. **Wait for elements properly**
   ```typescript
   // Good
   await expect(page.locator('.message')).toBeVisible()
   
   // Bad
   await page.waitForTimeout(1000)
   ```

3. **Isolate test data**
   - Use unique email addresses with timestamps
   - Clean up after tests
   - Don't rely on external state

4. **Test user journeys**
   - Complete flows, not just individual pages
   - Test error paths as well as happy paths

## Common Issues and Solutions

### Issue: Tests fail due to authentication
**Solution**: Mock Supabase client or use test credentials

### Issue: E2E tests timeout
**Solution**: Increase timeout in playwright.config.ts
```typescript
use: {
  timeout: 30000, // 30 seconds
}
```

### Issue: Tests pass locally but fail in CI
**Solution**: 
- Check environment variables
- Ensure database migrations are run
- Verify browser versions match

### Issue: Flaky tests
**Solution**:
- Use proper wait conditions
- Avoid hardcoded delays
- Check for race conditions
- Use test retries for known flaky tests

## Reporting

### Coverage Reports

After running `npm run test:coverage`, view the report:
- HTML report: `coverage/lcov-report/index.html`
- Coverage thresholds can be set in jest.config.js

### Playwright Reports

After E2E tests:
```bash
npx playwright show-report
```

Reports include:
- Test results
- Screenshots on failure
- Video recordings (if enabled)
- Trace files for debugging

## Contributing

When adding new features:
1. Write unit tests for business logic
2. Write E2E tests for user flows
3. Update the manual testing checklist
4. Ensure all tests pass before submitting PR
5. Maintain test coverage above 80%

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Docs](https://testing-library.com/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Supabase Testing Guide](https://supabase.com/docs/guides/testing)
