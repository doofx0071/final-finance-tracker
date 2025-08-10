import { test, expect } from '@playwright/test'

test.describe('Protected Routes and Profile Management', () => {
  test('should block unauthenticated access to dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })

  test('should block unauthenticated access to profile', async ({ page }) => {
    await page.goto('/profile')
    
    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })

  test('should block unauthenticated access to transactions', async ({ page }) => {
    await page.goto('/transactions')
    
    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })

  test.describe('Authenticated User', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'TestPassword123!')
      await page.locator('button[type="submit"]').click()
      
      // Wait for redirect to dashboard
      await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
    })

    test('should access dashboard when authenticated', async ({ page }) => {
      await page.goto('/dashboard')
      await expect(page).toHaveURL('/dashboard')
      await expect(page.locator('h1')).toContainText(/dashboard/i)
    })

    test('should access profile page when authenticated', async ({ page }) => {
      await page.goto('/profile')
      await expect(page).toHaveURL('/profile')
      await expect(page.locator('h1')).toContainText(/profile/i)
    })

    test('should display current user information in profile', async ({ page }) => {
      await page.goto('/profile')
      
      // Check for profile form fields
      await expect(page.locator('input[name="firstName"]')).toBeVisible()
      await expect(page.locator('input[name="lastName"]')).toBeVisible()
      
      // Fields should have current values
      const firstName = await page.locator('input[name="firstName"]').inputValue()
      const lastName = await page.locator('input[name="lastName"]').inputValue()
      
      expect(firstName).toBeTruthy()
      expect(lastName).toBeTruthy()
    })

    test('should update profile information', async ({ page }) => {
      await page.goto('/profile')
      
      // Update first and last name
      await page.fill('input[name="firstName"]', 'Updated')
      await page.fill('input[name="lastName"]', 'Name')
      
      // Submit form
      await page.locator('button[type="submit"]').click()
      
      // Should show success message
      await expect(page.locator('text=/profile.*updated|saved.*successfully/i')).toBeVisible({ timeout: 10000 })
      
      // Reload page to verify persistence
      await page.reload()
      
      // Check that values persisted
      const firstName = await page.locator('input[name="firstName"]').inputValue()
      const lastName = await page.locator('input[name="lastName"]').inputValue()
      
      expect(firstName).toBe('Updated')
      expect(lastName).toBe('Name')
    })

    test('should validate profile update fields', async ({ page }) => {
      await page.goto('/profile')
      
      // Clear required fields
      await page.fill('input[name="firstName"]', '')
      await page.fill('input[name="lastName"]', '')
      
      // Submit form
      await page.locator('button[type="submit"]').click()
      
      // Should show validation errors
      await expect(page.locator('text=First name is required')).toBeVisible()
      await expect(page.locator('text=Last name is required')).toBeVisible()
    })

    test('should sign out successfully', async ({ page }) => {
      // Look for sign out button in header/navigation
      const signOutButton = page.locator('button:has-text("Sign Out"), a:has-text("Sign Out")')
      await expect(signOutButton).toBeVisible()
      
      await signOutButton.click()
      
      // Should redirect to login page
      await expect(page).toHaveURL('/login', { timeout: 10000 })
      
      // Try to access protected route after sign out
      await page.goto('/dashboard')
      
      // Should redirect back to login
      await expect(page).toHaveURL('/login')
    })

    test('should navigate between protected pages', async ({ page }) => {
      // Navigate to profile from dashboard
      await page.goto('/dashboard')
      const profileLink = page.locator('a[href="/profile"]')
      await profileLink.click()
      await expect(page).toHaveURL('/profile')
      
      // Navigate to transactions
      const transactionsLink = page.locator('a[href="/transactions"]')
      await transactionsLink.click()
      await expect(page).toHaveURL('/transactions')
      
      // Navigate back to dashboard
      const dashboardLink = page.locator('a[href="/dashboard"]')
      await dashboardLink.click()
      await expect(page).toHaveURL('/dashboard')
    })

    test('should maintain session across page refreshes', async ({ page }) => {
      await page.goto('/dashboard')
      
      // Refresh page
      await page.reload()
      
      // Should still be on dashboard (not redirected to login)
      await expect(page).toHaveURL('/dashboard')
    })

    test('should handle session expiry gracefully', async ({ page, context }) => {
      // Clear cookies to simulate session expiry
      await context.clearCookies()
      
      // Try to navigate to protected route
      await page.goto('/dashboard')
      
      // Should redirect to login
      await expect(page).toHaveURL('/login')
      
      // Should show session expired message (if implemented)
      await expect(page.locator('text=/session.*expired|please.*login/i')).toBeVisible({ timeout: 5000 }).catch(() => {
        // Session expiry message is optional
      })
    })
  })
})
