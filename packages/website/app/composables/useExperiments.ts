import { nanoid } from 'nanoid'

// Hardcoded experiment tag for now
const CURRENT_EXPERIMENT = 'none'

export const useExperiments = () => {
  // Define all Nuxt state/cookies at the top level of the composable
  // to ensure consistent lifecycle management and avoid redundant watchers.
  const hasPushed = useState('experiment_pushed', () => false)
  const gaCookie = useCookie('_ga')
  const experimentCookie = useCookie('experiment_group', {
    maxAge: 60 * 60 * 24 * 365,
    watch: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
  const userId = useCookie('experiment_user_id', {
    maxAge: 60 * 60 * 24 * 365,
    watch: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  // Sync logic (only runs if userId is missing)
  if (!userId.value) {
    if (gaCookie.value) {
      const parts = gaCookie.value.split('.')
      userId.value = parts.slice(-2).join('.')
    } else if (import.meta.client) {
      userId.value = nanoid()
    }
    // We don't set a default 'anonymous' value here to allow
    // client-side generation if the cookie is missing during SSR.
  }

  /**
   * Deterministically get a variation for an experiment based on user ID.
   */
  const getVariation = (experimentId: string): 'control' | 'variantOne' => {
    const id = userId.value || 'anonymous'
    const str = `${experimentId}:${id}`
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash |= 0
    }
    return Math.abs(hash) % 2 === 0 ? 'control' : 'variantOne'
  }

  /**
   * Push experiment data to GTM dataLayer
   */
  const pushToDataLayer = (experimentGroup: string) => {
    if (import.meta.client && typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'experiment_assignment',
        experiment_id: CURRENT_EXPERIMENT,
        experiment_group: experimentGroup
      })
    }
  }

  /**
   * Initialize experiment tracking with GTM/GA
   */
  const initializeExperiment = () => {
    const experimentGroup = getVariation(CURRENT_EXPERIMENT)

    if (!experimentCookie.value) {
      experimentCookie.value = experimentGroup
    }

    // Single push per session on client
    if (import.meta.client && !hasPushed.value) {
      pushToDataLayer(experimentCookie.value || experimentGroup)
      hasPushed.value = true
    }

    return (experimentCookie.value || experimentGroup) as 'control' | 'variantOne'
  }

  return {
    getVariation,
    userId,
    initializeExperiment,
    pushToDataLayer,
    currentExperiment: CURRENT_EXPERIMENT
  }
}
