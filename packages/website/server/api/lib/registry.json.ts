export default defineEventHandler(async () => {
  const LATEST_VERSION = '0.0.17'

  const components = [
    {
      name: 'ProgressCircle',
      description: 'Animated circular progress indicator',
      version: LATEST_VERSION
    },
    {
      name: 'StatusTracker',
      description: 'Multi-step status tracking component',
      version: LATEST_VERSION
    },
    {
      name: 'CategoryDistribution',
      description: 'Category distribution visualization',
      version: LATEST_VERSION
    },
    {
      name: 'Calendar',
      description: 'Interactive calendar component',
      version: LATEST_VERSION
    }
  ]

  return {
    latestVersion: LATEST_VERSION,
    components,
    updatedAt: new Date().toISOString()
  }
})
