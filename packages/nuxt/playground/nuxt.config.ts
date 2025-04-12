export default defineNuxtConfig({
  modules: ['../src/module'],

  vueChrts: {
    prefix: '', // Add a prefix to component names
    global: true,    // Register as global components
    autoImports: true, // Enable auto-imports
    include: []      // Include all components
  },

  devtools: { enabled: true },
  compatibilityDate: '2025-04-08'
})