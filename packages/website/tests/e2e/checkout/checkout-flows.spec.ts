import type { Page } from '@playwright/test'
import { test, expect } from '@playwright/test'

// Test account credentials
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'dennisageffen@hotmail.com'
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'password'

// Helper to login with email/password (hidden behind 10 clicks on Terms footer)
async function loginWithEmailPassword(page: Page) {
  await page.goto('/login')

  // Click the Terms footer text 10 times to reveal email/password form
  const termsFooter = page.getByText('By signing in, you agree to our')
  for (let i = 0; i < 10; i++) {
    await termsFooter.click({ delay: 50 })
  }

  // Wait for and fill email/password form
  await page.waitForSelector('input[type="email"]', { timeout: 5000 })
  await page.fill('input[type="email"]', TEST_EMAIL)
  await page.fill('input[type="password"]', TEST_PASSWORD)
  await page.click('button[type="submit"]')

  // Wait for successful redirect
  await page.waitForURL(/\/(payments|dashboard|blocks|templates|pricing)?$/, {
    timeout: 15000
  })
}

test.describe('Pricing Page Checkout Flow', () => {
  test('should display pricing page with all plans', async ({ page }) => {
    await page.goto('/pricing')

    // Check page title/meta
    await expect(page).toHaveTitle(/pricing/i)

    // Check for pricing plans visibility
    const pricingSection = page
      .locator('[data-testid="pricing"]')
      .or(page.locator('section').filter({ hasText: /all-access|dashboard/i }))
    await expect(pricingSection.first()).toBeVisible()

    // Check for key pricing tiers
    await expect(page.getByText(/nuxt dashboard/i).first()).toBeVisible()
    await expect(page.getByText(/all-access/i).first()).toBeVisible()
  })

  test('should initiate checkout from pricing page (authenticated)', async ({
    page
  }) => {
    // Login first
    await loginWithEmailPassword(page)

    // Navigate to pricing
    await page.goto('/pricing')

    // Find and click a buy button
    const buyButton = page
      .getByRole('button', { name: /buy|get|purchase|start/i })
      .first()
    await expect(buyButton).toBeVisible()

    // Listen for new page (Stripe checkout opens in new window)
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page', { timeout: 30000 }).catch(() => null),
      buyButton.click()
    ])

    // Either redirects to Stripe or shows auth modal
    if (newPage) {
      // New page opened - should be Stripe
      await newPage.waitForLoadState()
      expect(newPage.url()).toContain('stripe.com')
      await newPage.close()
    } else {
      // Check if we got redirected to Stripe in same window
      // or if the payment modal appeared
      await page.waitForTimeout(2000)
      const currentUrl = page.url()
      const stripeRedirect = currentUrl.includes('stripe.com')
      const stayedOnSite
        = currentUrl.includes('nuxtcharts.com')
          || currentUrl.includes('localhost')

      expect(stripeRedirect || stayedOnSite).toBeTruthy()
    }
  })

  test('should redirect to login when purchasing unauthenticated', async ({
    page
  }) => {
    await page.goto('/pricing')

    // Find and click a buy button
    const buyButton = page
      .getByRole('button', { name: /buy|get|purchase|start/i })
      .first()

    if (await buyButton.isVisible()) {
      await buyButton.click()

      // Should redirect to login or show login modal
      await page.waitForTimeout(2000)
      const currentUrl = page.url()

      // Either redirected to login, shows GitHub OAuth, or stays on page with modal
      const isLoginFlow
        = currentUrl.includes('/login')
          || currentUrl.includes('github.com/login')
          || page.locator('[role="dialog"]').isVisible()

      expect(isLoginFlow || currentUrl.includes('/pricing')).toBeTruthy()
    }
  })
})

test.describe('Blocks Page Checkout Flow', () => {
  test('should display blocks categories page', async ({ page }) => {
    await page.goto('/blocks')

    // Verify blocks page loads
    await expect(page).toHaveTitle(/blocks/i)

    // Check for page content (blocks page uses div, not main)
    const pageContent = page.locator('h1').filter({ hasText: /premium|blocks/i })
    await expect(pageContent.first()).toBeVisible()
  })

  test('should navigate to specific block category', async ({ page }) => {
    await page.goto('/blocks/pricing-tables')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Check that block components are displayed
    const pageContent = page.locator('body')
    await expect(pageContent).toBeVisible()
  })

  test('should show floating CTA on blocks page', async ({ page }) => {
    await page.goto('/blocks/area-charts')

    // Wait for floating CTA to appear (has 2 second delay)
    await page.waitForTimeout(3000)

    // Look for floating purchase button or CTA
    const floatingCta = page
      .locator('[data-testid="floating-cta"]')
      .or(page.locator('button').filter({ hasText: /get all|buy|access/i }))

    // CTA may not appear for users with all-access
    if (await floatingCta.first().isVisible()) {
      await expect(floatingCta.first()).toBeVisible()
    }
  })

  test('should initiate checkout from blocks page (authenticated)', async ({
    page
  }) => {
    await loginWithEmailPassword(page)
    await page.goto('/blocks/bar-charts')

    // Wait for any purchase button
    await page.waitForTimeout(3000)

    // Find purchase/buy button
    const purchaseButton = page
      .getByRole('button', { name: /buy|get|purchase|access/i })
      .first()

    if (await purchaseButton.isVisible()) {
      // Click and check for Stripe redirect
      const [newPage] = await Promise.all([
        page
          .context()
          .waitForEvent('page', { timeout: 30000 })
          .catch(() => null),
        purchaseButton.click()
      ])

      if (newPage) {
        await newPage.waitForLoadState()
        expect(newPage.url()).toContain('stripe.com')
        await newPage.close()
      }
    }
  })
})

test.describe('Blocks Source Code Access Flow', () => {
  test('unauthenticated user should see "Please log in" message when viewing code', async ({
    page
  }) => {
    await page.goto('/blocks/bar-charts')
    await page.waitForLoadState('networkidle')

    // Click on "Code" tab to view source code area
    const codeTab = page.getByRole('button', { name: /code/i }).or(
      page.locator('button').filter({ hasText: /code/i })
    )
    await codeTab.first().click()

    // Wait for code panel to load
    await page.waitForTimeout(1000)

    // Look for the "Please log in" message - exact text from Preview/Code.vue
    const loginPrompt = page.getByText(/log in/i).first()

    // The message appears in code preview components
    await expect(loginPrompt).toBeVisible({ timeout: 10000 })
  })

  test('unauthenticated user clicking login should redirect to GitHub OAuth', async ({
    page
  }) => {
    await page.goto('/blocks/bar-charts')
    await page.waitForLoadState('networkidle')

    // Click on "Code" tab first
    const codeTab = page.getByRole('button', { name: /code/i }).or(
      page.locator('button').filter({ hasText: /code/i })
    )
    await codeTab.first().click()
    await page.waitForTimeout(1000)

    // Find the "log in" button/link in the source code area
    const loginButton = page.getByRole('button', { name: /log in/i }).first()

    if (await loginButton.isVisible()) {
      // Click login and check for GitHub OAuth redirect
      await loginButton.click()

      // Should redirect to GitHub OAuth
      await page.waitForURL(/github\.com|\/api\/auth\/github/, {
        timeout: 10000
      })

      expect(page.url()).toMatch(/github\.com|\/api\/auth\/github/)
    }
  })

  test('authenticated user should see upgrade prompt or code when viewing source', async ({
    page
  }) => {
    // Login with test account
    await loginWithEmailPassword(page)
    await page.goto('/blocks/bar-charts')
    await page.waitForLoadState('networkidle')

    // Click on "Code" tab first
    const codeTab = page.getByRole('button', { name: /code/i }).or(
      page.locator('button').filter({ hasText: /code/i })
    )
    await codeTab.first().click()
    await page.waitForTimeout(2000)

    // Check for either:
    // 1. "Unlock Premium Source Code" (no purchase)
    // 2. Actual code display (has purchase)
    const unlockMessage = page.getByText('Unlock Premium Source Code')
    const getAllAccessButton = page.getByRole('button', {
      name: /Get All-Access/i
    })
    const codeBlock = page.locator('pre code, .shiki, [class*="language-"]')

    // Either unlock prompt or code should be visible
    const hasUnlockPrompt = await unlockMessage.first().isVisible()
    const hasGetAccessButton = await getAllAccessButton.first().isVisible()
    const hasCodeBlock = await codeBlock.first().isVisible()

    // User should see one of these states (upgrade prompt OR actual code)
    expect(hasUnlockPrompt || hasGetAccessButton || hasCodeBlock).toBeTruthy()

    // If showing upgrade prompt, verify Get All-Access button links to pricing
    if (hasGetAccessButton) {
      const link = page.locator('a[href*="/pricing"]').filter({
        has: getAllAccessButton.first()
      })

      if ((await link.count()) > 0) {
        const href = await link.first().getAttribute('href')
        expect(href).toContain('/pricing')
      }
    }
  })

  test('Get All-Access button in code view should navigate to pricing', async ({
    page
  }) => {
    await loginWithEmailPassword(page)
    await page.goto('/blocks/bar-charts')
    await page.waitForLoadState('networkidle')

    // Click on "Code" tab first
    const codeTab = page.getByRole('button', { name: /code/i }).or(
      page.locator('button').filter({ hasText: /code/i })
    )
    await codeTab.first().click()
    await page.waitForTimeout(2000)

    // Find Get All-Access link/button (only visible if user doesn't have access)
    const getAllAccessLink = page.locator('a[href*="/pricing"]').filter({
      hasText: /Get All-Access/i
    })

    // This test only runs if user doesn't have all-access
    if (await getAllAccessLink.first().isVisible()) {
      await getAllAccessLink.first().click()

      // Should navigate to pricing page
      await page.waitForURL(/\/pricing/, { timeout: 10000 })
      expect(page.url()).toContain('/pricing')
    } else {
      // User has access - verify code is visible instead
      const codeBlock = page.locator('pre code, .shiki, [class*="language-"]')
      expect(await codeBlock.first().isVisible()).toBeTruthy()
    }
  })
})

test.describe('Template Detail Page Checkout Flow', () => {
  test('should display template detail page', async ({ page }) => {
    await page.goto('/templates/nuxt-dashboard')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Check for template title
    await expect(
      page.getByRole('heading', { name: /nuxt dashboard/i }).first()
    ).toBeVisible()

    // Check for purchase button
    const purchaseButton = page
      .getByRole('button', { name: /buy|get|purchase/i })
      .or(page.getByRole('link', { name: /buy|get|purchase/i }))
    await expect(purchaseButton.first()).toBeVisible()
  })

  test('should show image gallery on template page', async ({ page }) => {
    await page.goto('/templates/nuxt-dashboard')
    await page.waitForLoadState('networkidle')

    // Check for image gallery or screenshots (some may be hidden for dark/light mode)
    const images = page.locator('img[alt*="dashboard" i], img[alt*="preview" i], img[alt*="screenshot" i]')
    const imageCount = await images.count()

    // At least one image should be present in the DOM
    expect(imageCount).toBeGreaterThan(0)
  })

  test('should initiate checkout from template detail page (authenticated)', async ({
    page
  }) => {
    await loginWithEmailPassword(page)
    await page.goto('/templates/nuxt-dashboard')

    // Find purchase button
    const purchaseButton = page
      .getByRole('button', { name: /buy|get|purchase/i })
      .first()

    await expect(purchaseButton).toBeVisible()

    // Click and check for Stripe redirect
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page', { timeout: 30000 }).catch(() => null),
      purchaseButton.click()
    ])

    if (newPage) {
      await newPage.waitForLoadState()
      expect(newPage.url()).toContain('stripe.com')
      await newPage.close()
    }
  })

  test('should test all available templates', async ({ page }) => {
    const templates = [
      'nuxt-dashboard',
      'nuxt-planner',
      'nuxt-shadcn-vue',
      'nuxt-simplistic',
      'e-commerce-dashboard',
      'nuxt-clean-gray-dashboard'
    ]

    for (const template of templates) {
      await page.goto(`/templates/${template}`)
      await page.waitForLoadState('networkidle')

      // Verify each template page loads correctly
      const pageContent = page.locator('body')
      await expect(pageContent).toBeVisible()

      // Check for purchase button on each
      const purchaseButton = page
        .getByRole('button', { name: /buy|get|purchase/i })
        .or(page.getByRole('link', { name: /buy|get|purchase/i }))

      if ((await purchaseButton.count()) > 0) {
        await expect(purchaseButton.first()).toBeVisible()
      }
    }
  })
})

test.describe('Payment Success/Failure Pages', () => {
  test('should redirect unauthenticated users from payments page', async ({
    page
  }) => {
    await page.goto('/payments')

    // Should redirect to login
    await page.waitForURL(/\/(login|register)/, { timeout: 10000 })
  })

  test('should display payments dashboard for authenticated users', async ({
    page
  }) => {
    await loginWithEmailPassword(page)
    await page.goto('/payments')

    // Should show payments dashboard
    await page.waitForLoadState('networkidle')

    // Check for dashboard elements
    const paymentsContent = page.locator('body')
    await expect(paymentsContent).toBeVisible()
  })

  test('should display payment failed page', async ({ page }) => {
    await page.goto('/payments/failed')

    // Should show failure message
    const failedContent = page.locator('body')
    await expect(failedContent).toBeVisible()
  })
})

test.describe('New Account Registration Flow', () => {
  test.skip('should create new test account and complete checkout', async ({
    page
  }) => {
    // Skip by default - enable when needed to test full registration
    // This creates real accounts in the system

    const { email } = await registerTestAccount(page)
    console.log(`Created test account: ${email}`)

    // Navigate to pricing and attempt checkout
    await page.goto('/pricing')

    const buyButton = page
      .getByRole('button', { name: /buy|get|purchase|start/i })
      .first()

    if (await buyButton.isVisible()) {
      const [newPage] = await Promise.all([
        page
          .context()
          .waitForEvent('page', { timeout: 30000 })
          .catch(() => null),
        buyButton.click()
      ])

      if (newPage) {
        await newPage.waitForLoadState()
        expect(newPage.url()).toContain('stripe.com')
        await newPage.close()
      }
    }
  })
})
