import { test, expect } from '@playwright/test'

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('should display registration form', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Create Account')
    await expect(page.locator('input[name="firstName"]')).toBeVisible()
    await expect(page.locator('input[name="lastName"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Submit empty form
    await page.locator('button[type="submit"]').click()
    
    // Check for validation errors
    await expect(page.locator('text=First name is required')).toBeVisible()
    await expect(page.locator('text=Last name is required')).toBeVisible()
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email')
    await page.locator('input[name="password"]').click() // Trigger blur
    
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible()
  })

  test('should validate password strength', async ({ page }) => {
    // Test weak password
    await page.fill('input[name="password"]', 'weak')
    await page.locator('input[name="confirmPassword"]').click() // Trigger blur
    
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible()
    
    // Test password without uppercase
    await page.fill('input[name="password"]', 'password123!')
    await expect(page.locator('text=Password must contain')).toBeVisible()
    
    // Test password without special character
    await page.fill('input[name="password"]', 'Password123')
    await expect(page.locator('text=Password must contain')).toBeVisible()
  })

  test('should show password strength indicator', async ({ page }) => {
    // Check for password strength indicator
    await page.fill('input[name="password"]', 'weak')
    await expect(page.locator('[data-testid="password-strength"]')).toBeVisible()
    
    // Strong password should show green indicator
    await page.fill('input[name="password"]', 'StrongP@ssw0rd123')
    const strengthIndicator = page.locator('[data-testid="password-strength"]')
    await expect(strengthIndicator).toBeVisible()
  })

  test('should validate password confirmation', async ({ page }) => {
    await page.fill('input[name="password"]', 'Password123!')
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!')
    await page.locator('button[type="submit"]').click()
    
    await expect(page.locator('text=Passwords don\'t match')).toBeVisible()
  })

  test('should successfully register with valid data', async ({ page }) => {
    const timestamp = Date.now()
    const testEmail = `test${timestamp}@example.com`
    
    await page.fill('input[name="firstName"]', 'John')
    await page.fill('input[name="lastName"]', 'Doe')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', 'TestPassword123!')
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!')
    
    await page.locator('button[type="submit"]').click()
    
    // Should redirect to login or show success message
    await expect(page).toHaveURL(/\/(login|dashboard)/, { timeout: 10000 })
  })

  test('should handle duplicate email registration', async ({ page }) => {
    // First registration
    const testEmail = 'duplicate@example.com'
    
    await page.fill('input[name="firstName"]', 'John')
    await page.fill('input[name="lastName"]', 'Doe')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', 'TestPassword123!')
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!')
    
    await page.locator('button[type="submit"]').click()
    
    // Try to register with same email
    await page.goto('/register')
    await page.fill('input[name="firstName"]', 'Jane')
    await page.fill('input[name="lastName"]', 'Smith')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', 'TestPassword123!')
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!')
    
    await page.locator('button[type="submit"]').click()
    
    // Should show error about duplicate email
    await expect(page.locator('text=/email.*already.*exist/i')).toBeVisible({ timeout: 10000 })
  })

  test('should have link to login page', async ({ page }) => {
    const loginLink = page.locator('a[href="/login"]')
    await expect(loginLink).toBeVisible()
    await expect(loginLink).toContainText(/sign in/i)
    
    await loginLink.click()
    await expect(page).toHaveURL('/login')
  })
})
