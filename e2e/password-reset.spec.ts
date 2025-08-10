import { test, expect } from '@playwright/test'

test.describe('Password Reset Flow', () => {
  test('should display password reset request form', async ({ page }) => {
    await page.goto('/reset-request')
    
    await expect(page.locator('h2')).toContainText(/reset.*password|forgot.*password/i)
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should validate email in reset request', async ({ page }) => {
    await page.goto('/reset-request')
    
    // Submit empty form
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=Email is required')).toBeVisible()
    
    // Invalid email format
    await page.fill('input[name="email"]', 'invalid-email')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible()
  })

  test('should handle password reset request submission', async ({ page }) => {
    await page.goto('/reset-request')
    
    await page.fill('input[name="email"]', 'test@example.com')
    await page.locator('button[type="submit"]').click()
    
    // Should show success message
    await expect(page.locator('text=/check.*email|reset.*link.*sent/i')).toBeVisible({ timeout: 10000 })
  })

  test('should handle non-existent email gracefully', async ({ page }) => {
    await page.goto('/reset-request')
    
    await page.fill('input[name="email"]', 'nonexistent@example.com')
    await page.locator('button[type="submit"]').click()
    
    // Should show generic success message (for security)
    await expect(page.locator('text=/check.*email|reset.*link.*sent/i')).toBeVisible({ timeout: 10000 })
  })

  test('should validate new password in reset form', async ({ page }) => {
    // Navigate to reset page with token (simulated)
    await page.goto('/reset?token=test-token')
    
    await expect(page.locator('h2')).toContainText(/set.*new.*password|reset.*password/i)
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible()
    
    // Test weak password
    await page.fill('input[name="password"]', 'weak')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible()
    
    // Test password mismatch
    await page.fill('input[name="password"]', 'StrongPassword123!')
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('text=Passwords don\'t match')).toBeVisible()
  })

  test('should successfully reset password with valid token', async ({ page }) => {
    // Navigate to reset page with token
    await page.goto('/reset?token=test-token')
    
    await page.fill('input[name="password"]', 'NewPassword123!')
    await page.fill('input[name="confirmPassword"]', 'NewPassword123!')
    await page.locator('button[type="submit"]').click()
    
    // Should redirect to login after successful reset
    await expect(page).toHaveURL('/login', { timeout: 10000 })
    
    // Should show success message
    await expect(page.locator('text=/password.*updated|reset.*successful/i')).toBeVisible()
  })

  test('should handle invalid/expired token', async ({ page }) => {
    // Navigate to reset page with invalid token
    await page.goto('/reset?token=invalid-token')
    
    // Should show error message
    await expect(page.locator('text=/invalid.*token|expired.*link/i')).toBeVisible({ timeout: 10000 })
  })

  test('should have link back to login', async ({ page }) => {
    await page.goto('/reset-request')
    
    const loginLink = page.locator('a[href="/login"]')
    await expect(loginLink).toBeVisible()
    await expect(loginLink).toContainText(/back.*login|sign in/i)
    
    await loginLink.click()
    await expect(page).toHaveURL('/login')
  })

  test('complete password reset flow', async ({ page }) => {
    // Step 1: Request password reset
    await page.goto('/reset-request')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.locator('button[type="submit"]').click()
    
    // Check for success message
    await expect(page.locator('text=/check.*email/i')).toBeVisible({ timeout: 10000 })
    
    // Step 2: Simulate clicking reset link from email (navigate with token)
    const resetToken = 'test-reset-token-123'
    await page.goto(`/reset?token=${resetToken}`)
    
    // Step 3: Set new password
    const newPassword = 'UpdatedPassword123!'
    await page.fill('input[name="password"]', newPassword)
    await page.fill('input[name="confirmPassword"]', newPassword)
    await page.locator('button[type="submit"]').click()
    
    // Should redirect to login
    await expect(page).toHaveURL('/login', { timeout: 10000 })
    
    // Step 4: Login with new password
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', newPassword)
    await page.locator('button[type="submit"]').click()
    
    // Should successfully login and redirect to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
  })
})
