import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom',
        mock: {
          // Mock Sentry to avoid issues in tests
          indexedDb: true
        }
      }
    },
    include: ['tests/unit/**/*.{test,spec}.ts'],
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // Exclude Sentry from being processed
    server: {
      deps: {
        inline: ['@nuxt/test-utils']
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['app/components/lib/**/*.vue'],
      exclude: ['**/node_modules/**', '**/types.ts']
    }
  }
})
