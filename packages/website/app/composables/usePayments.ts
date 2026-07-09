export function usePayments() {
  const getGaClientId = () => {
    const gaCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('_ga='))

    if (!gaCookie) {
      return null
    }

    // The client ID is the last two parts of the cookie value
    const parts = gaCookie.split('.')
    if (parts.length < 2) {
      return null
    }

    return parts.slice(-2).join('.')
  }

  const getGaSessionId = () => {
    try {
      if (!import.meta.client) return null

      const config = useRuntimeConfig()
      const measurementId = config.public.gaMeasurementId
      if (!measurementId) return null

      // Remove 'G-' if present
      const cleanId = measurementId.startsWith('G-') ? measurementId.slice(2) : measurementId
      const cookieName = `_ga_${cleanId}`

      const gaCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${cookieName}=`))

      if (!gaCookie) {
        return null
      }

      // Value format: GS1.1.<sessionId>.<timestamp>.<sessionCount>.<etc>
      const parts = gaCookie.split('.')
      if (parts.length < 3) {
        return null
      }

      return parts[2]
    } catch {
      // Silently fail - session ID is optional
      return null
    }
  }

  const getAllLicense = async () => {
    const { trackBeginCheckout } = useButtonTracking()
    trackBeginCheckout([{ item_id: 'all-access' }])

    if (import.meta.client) {
      window.location.href = '/buy/all-access'
    }
  }

  const purchaseDashboard = async (priceKey: string, event?: Event) => {
    const { loggedIn } = useUserSession()
    const colorMode = useColorMode()
    const clientId = getGaClientId()
    const sessionId = getGaSessionId()
    const affiliateId = useCookie('affiliateId').value

    if (loggedIn.value) {
      const paymentURL = await $fetch(`/api/payments/${priceKey}/create`, {
        method: 'POST',
        body: {
          clientId: clientId || undefined,
          affiliateId: affiliateId || undefined,
          colorMode: colorMode.value || undefined,
          sessionId: sessionId || undefined
        }
      })
      if (typeof paymentURL === 'string' && paymentURL) {
        window.open(paymentURL)
      }
    } else {
      const redirectCookie = useCookie('redirectPath')
      const params = new URLSearchParams()
      params.set('priceId', priceKey)
      if (clientId) params.set('clientId', clientId)
      if (affiliateId) params.set('affiliateId', affiliateId)
      if (colorMode.value) params.set('colorMode', colorMode.value)
      if (sessionId) params.set('sessionId', sessionId)

      redirectCookie.value = `/api/payments/redirect?${params.toString()}`
      window.open(`/api/auth/github`)
    }

    const { trackBeginCheckout } = useButtonTracking()
    trackBeginCheckout([{ item_id: priceKey }])
  }

  return {
    getAllLicense,
    purchaseDashboard
  }
}
