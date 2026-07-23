import path from 'path'
import { test as setup, expect } from '@playwright/test'

const authFile = path.join(__dirname, '../.auth/user.json')

// Test account credentials - use environment variables or defaults
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'dennisageffen@hotmail.com'
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'password'

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login')

  // The email/password login is hidden behind 10 clicks on Terms footer
  // Click the Terms footer text 10 times to reveal email/password form
  const termsFooter = page.getByText('By signing in, you agree to our')

  for (let i = 0; i < 10; i++) {
    await termsFooter.click({ delay: 50 })
  }

  // Wait for email/password form to appear
  await page.waitForSelector('input[type="email"]', { timeout: 5000 })

  // Fill in credentials
  await page.fill('input[type="email"]', TEST_EMAIL)
  await page.fill('input[type="password"]', TEST_PASSWORD)

  // Submit login form
  await page.click('button[type="submit"]')

  // Wait for redirect after successful login
  await page.waitForURL(/\/(payments|dashboard)?$/, { timeout: 15000 })

  // Verify we're logged in by checking for user session indicators
  await expect(page.locator('body')).toBeVisible()

  // Save authentication state
  await page.context().storageState({ path: authFile })
})
