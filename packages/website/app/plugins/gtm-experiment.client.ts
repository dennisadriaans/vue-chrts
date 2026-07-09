export default defineNuxtPlugin(() => {
  const { initializeExperiment } = useExperiments()

  // Initialize experiment on app mount
  const experimentGroup = initializeExperiment()

  // Set user property in GTM for all subsequent events
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []

    // Ensure it's available immediately for any GA4 Config tags
    window.dataLayer.push({
      experiment_group: experimentGroup,
      user_properties: {
        experiment_group: experimentGroup
      }
    })

    // Also push to Google Analytics if using gtag.js directly
    if (typeof window.gtag !== 'undefined') {
      window.gtag('set', 'user_properties', {
        experiment_group: experimentGroup
      })
    }
  }

  return {
    provide: {
      experimentGroup
    }
  }
})
