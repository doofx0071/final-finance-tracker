import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login form', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Welcome Back')
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Submit empty form
    await page.locator('button[type="submit"]').click()
    
    // Check for validation errors
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email')
    await page.locator('input[name="password"]').click() // Trigger blur
    
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible()
  })

  test('should handle login failure with invalid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'nonexistent@example.com')
    await page.fill('input[name="password"]', 'WrongPassword123!')
    
    await page.locator('button[type="submit"]').click()
    
    // Should show error message
    await expect(page.locator('text=/invalid.*credentials|email.*password.*incorrect/i')).toBeVisible({ timeout: 10000 })
  })

  test('should successfully login with valid credentials', async ({ page }) => {
    // Note: This test requires a test user to be set up in the database
    // You may need to create a test user or mock the authentication
    const testEmail = 'test@example.com'
    const testPassword = 'TestPassword123!'
    
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)
    
    await page.locator('button[type="submit"]').click()
    
    // Should redirect to dashboard after successful login
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
  })

  test('should redirect authenticated users away from login', async ({ page, context }) => {
    // Simulate authenticated state by setting a cookie
    // Note: This is a simplified example. In real scenarios, you'd need proper auth tokens
    await context.addCookies([
      {
        name: 'auth-token',
        value: 'test-token',
        domain: 'localhost',
        path: '/',
      },
    ])
    
    await page.goto('/login')
    
    // Should redirect to dashboard if already authenticated
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
  })

  test('should have link to registration page', async ({ page }) => {
    const registerLink = page.locator('a[href="/register"]')
    await expect(registerLink).toBeVisible()
    await expect(registerLink).toContainText(/sign up|create.*account/i)
    
    await registerLink.click()
    await expect(page).toHaveURL('/register')
  })

  test('should have link to password reset', async ({ page }) => {
    const resetLink = page.locator('a[href="/reset-request"]')
    await expect(resetLink).toBeVisible()
    await expect(resetLink).toContainText(/forgot.*password/i)
    
    await resetLink.click()
    await expect(page).toHaveURL('/reset-request')
  })

  test('should show/hide password toggle', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]')
    const toggleButton = page.locator('button[aria-label="Toggle password visibility"]')
    
    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Click toggle to show password
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Click again to hide password
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should display Google OAuth option', async ({ page }) => {
    const googleButton = page.locator('button:has-text("Continue with Google")')
    await expect(googleButton).toBeVisible()
  })

  test('should handle Google OAuth flow', async ({ page }) => {
    const googleButton = page.locator('button:has-text("Continue with Google")')
    
    // Click Google OAuth button
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      googleButton.click(),
    ])
    
    // Check that OAuth popup opened with Google URL
    await expect(popup.url()).toContain('accounts.google.com')
    
    // Close popup to simulate cancellation
    await popup.close()
    
    // Should remain on login page
    await expect(page).toHaveURL('/login')
  })
})
