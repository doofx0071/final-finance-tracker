# Authentication System Testing Checklist

## Manual Test Matrix

### 1. Registration Tests

#### Valid Registration
- [ ] Fill all fields with valid data
  - First Name: Valid string (e.g., "John")
  - Last Name: Valid string (e.g., "Doe")
  - Email: Valid format (e.g., "user@example.com")
  - Password: Strong password (e.g., "SecurePass123!")
  - Confirm Password: Matches password
- [ ] Verify form submission succeeds
- [ ] Check redirect to dashboard or login page
- [ ] Verify welcome email is sent (check email inbox)
- [ ] Confirm user record created in database

#### Invalid Registration
- [ ] Submit empty form - verify all required field errors show
- [ ] Invalid email formats:
  - [ ] Missing @ symbol: "userexample.com"
  - [ ] Missing domain: "user@"
  - [ ] Invalid TLD: "user@example"
  - [ ] Special characters: "user@#$%.com"
- [ ] Password validation:
  - [ ] Too short (< 8 chars): "Pass1!"
  - [ ] No uppercase: "password123!"
  - [ ] No lowercase: "PASSWORD123!"
  - [ ] No number: "Password!"
  - [ ] No special character: "Password123"
- [ ] Password mismatch: Different values in password and confirm password
- [ ] First/Last name validation:
  - [ ] Empty first name
  - [ ] Empty last name
  - [ ] Exceeding max length (>50 chars)

#### Duplicate Email
- [ ] Register with an email
- [ ] Try registering again with same email
- [ ] Verify error message about existing account
- [ ] Check that duplicate record is not created

#### Password Strength Indicator
- [ ] Type weak password - verify indicator shows red/weak
- [ ] Type medium password - verify indicator shows yellow/medium
- [ ] Type strong password - verify indicator shows green/strong
- [ ] Verify indicator updates in real-time as typing

### 2. Email Confirmation Tests

#### Follow Confirmation Link
- [ ] Register new account
- [ ] Check email for confirmation message
- [ ] Click confirmation link
- [ ] Verify email is confirmed in database
- [ ] Check redirect to appropriate page

#### Session Establishment
- [ ] After email confirmation, verify user is logged in
- [ ] Check session cookies are set
- [ ] Verify can access protected routes without re-login

#### Route to Dashboard
- [ ] After confirmation, verify redirect to dashboard
- [ ] Check dashboard displays user's name
- [ ] Verify all dashboard features are accessible

### 3. Login Tests

#### Successful Login
- [ ] Enter valid email and password
- [ ] Submit form
- [ ] Verify redirect to dashboard
- [ ] Check session is established
- [ ] Verify user info displayed correctly

#### Failed Login
- [ ] Wrong password - verify error message
- [ ] Non-existent email - verify error message
- [ ] Empty fields - verify validation errors
- [ ] Invalid email format - verify validation error
- [ ] Account not verified (if applicable) - verify appropriate message

#### Already Authenticated
- [ ] Login successfully
- [ ] Navigate to /login while logged in
- [ ] Verify redirect to dashboard
- [ ] Check no double authentication occurs

### 4. Google OAuth Tests

#### Success Path
- [ ] Click "Continue with Google" button
- [ ] Complete Google authentication
- [ ] Verify redirect back to application
- [ ] Check user record created/updated
- [ ] Verify session established
- [ ] Check redirect to dashboard

#### Cancellation
- [ ] Click "Continue with Google" button
- [ ] Cancel/close Google popup
- [ ] Verify remain on login page
- [ ] Check no partial data created
- [ ] Verify can still use regular login

### 5. Password Reset Tests

#### Request Reset
- [ ] Navigate to password reset page
- [ ] Enter valid email
- [ ] Submit request
- [ ] Verify success message displayed
- [ ] Check reset email received

#### Recovery Link
- [ ] Click link in reset email
- [ ] Verify redirect to password reset form
- [ ] Check token is validated
- [ ] Verify form displays correctly

#### Update Password
- [ ] Enter new strong password
- [ ] Confirm new password
- [ ] Submit form
- [ ] Verify success message
- [ ] Check redirect to login

#### Login with New Password
- [ ] Use email and new password
- [ ] Verify successful login
- [ ] Check old password no longer works
- [ ] Verify session established correctly

### 6. Protected Routes Tests

#### Blocked When Unauthenticated
- [ ] Access /dashboard without login - verify redirect to login
- [ ] Access /profile without login - verify redirect to login
- [ ] Access /transactions without login - verify redirect to login
- [ ] Try direct URL access to protected routes - verify all redirect

#### Accessible When Authenticated
- [ ] Login successfully
- [ ] Navigate to /dashboard - verify access granted
- [ ] Navigate to /profile - verify access granted
- [ ] Navigate to /transactions - verify access granted
- [ ] Refresh page - verify remain authenticated

### 7. Profile Update Tests

#### Change First/Last Name
- [ ] Navigate to profile page
- [ ] Update first name
- [ ] Update last name
- [ ] Submit changes
- [ ] Verify success message
- [ ] Refresh page - verify changes persist
- [ ] Check database for updated values

#### Verify Persistence
- [ ] Make profile changes
- [ ] Logout
- [ ] Login again
- [ ] Navigate to profile
- [ ] Verify changes are still present

### 8. Sign Out Tests

#### Session Cleared
- [ ] Click sign out button
- [ ] Verify redirect to login page
- [ ] Check cookies/session cleared
- [ ] Try accessing protected route - verify redirect to login

#### Redirect After Sign Out
- [ ] Sign out from different pages (dashboard, profile, etc.)
- [ ] Verify all redirect to login
- [ ] Check return URL not retained after logout

## Automated Test Coverage

### Unit Tests (Jest)
Run with: `npm test`

- **Validation Schemas**
  - [x] Login schema validation
  - [x] Registration schema validation
  - [x] Password reset request validation
  - [x] Password reset validation
  - [x] Profile update validation

### E2E Tests (Playwright)
Run with: `npx playwright test`

- **Registration Flow**
  - [x] Form display and validation
  - [x] Password strength checking
  - [x] Duplicate email handling
  - [x] Successful registration

- **Login Flow**
  - [x] Form validation
  - [x] Failed login handling
  - [x] Successful login
  - [x] OAuth integration

- **Password Reset**
  - [x] Request submission
  - [x] Token validation
  - [x] Password update
  - [x] Complete flow test

- **Protected Routes**
  - [x] Authentication requirements
  - [x] Profile management
  - [x] Session handling
  - [x] Sign out functionality

## Test Execution Commands

```bash
# Run unit tests
npm test

# Run unit tests with coverage
npm test -- --coverage

# Run E2E tests
npx playwright test

# Run E2E tests in UI mode
npx playwright test --ui

# Run E2E tests for specific file
npx playwright test registration.spec.ts

# Run E2E tests in headed mode (see browser)
npx playwright test --headed

# Generate E2E test report
npx playwright show-report
```

## Test Data Setup

### Required Test Users
1. **Regular User**
   - Email: test@example.com
   - Password: TestPassword123!
   - First Name: Test
   - Last Name: User

2. **OAuth User**
   - Use Google test account
   - Ensure OAuth app configured in Supabase

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Set Supabase project URL and anon key
3. Configure OAuth providers in Supabase dashboard
4. Enable email confirmations in Supabase settings

## Bug Reporting Template

When reporting issues found during testing:

```markdown
### Bug Title
[Brief description]

### Steps to Reproduce
1. 
2. 
3. 

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser: 
- OS: 
- Test Type: Manual/Automated
- User Role: 

### Screenshots/Logs
[Attach if applicable]

### Severity
Critical/High/Medium/Low
```

## Testing Schedule

- **Daily**: Run automated unit tests
- **Before Deploy**: Run full E2E suite
- **Weekly**: Complete manual test matrix
- **After Major Changes**: Full regression testing

## Notes

- Always test in multiple browsers (Chrome, Firefox, Safari)
- Test on mobile devices/responsive views
- Verify accessibility with screen readers when possible
- Check console for JavaScript errors during testing
- Monitor network tab for failed API calls
- Test with slow network conditions (throttling)
