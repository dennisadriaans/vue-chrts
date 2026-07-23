import { vi, expect } from 'vitest'
import { config } from '@vue/test-utils'
import * as axeMatchers from 'vitest-axe/matchers'
import 'vitest-axe/extend-expect'

// Extend Vitest with axe matchers for a11y testing
expect.extend(axeMatchers)

// Mock ResizeObserver for components that use it
class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

// Mock Sentry to avoid initialization errors in tests
vi.mock('@sentry/nuxt', () => ({
  init: vi.fn(),
  replayIntegration: vi.fn(),
  browserTracingIntegration: vi.fn(),
  captureException: vi.fn(),
  captureMessage: vi.fn()
}))

// Mock vue-sonner toast
vi.mock('vue-sonner', () => ({
  toast: {
    add: vi.fn(),
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock useToast composable
vi.stubGlobal('useToast', () => ({
  add: vi.fn()
}))

// Global test configuration
config.global.stubs = {
  // Stub Nuxt components that might cause issues in tests
  NuxtLink: {
    template: '<a><slot /></a>'
  },
  ClientOnly: {
    template: '<slot />'
  }
}
