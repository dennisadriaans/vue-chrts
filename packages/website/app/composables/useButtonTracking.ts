export function useButtonTracking() {
  const { proxy } = useScriptGoogleTagManager()
  const route = useRoute()
  const { currentExperiment, initializeExperiment } = useExperiments()

  const trackEvent = (name: string, params: Record<string, any> = {}) => {
    const experimentGroup = initializeExperiment()

    // Standard parameters for EVERY event
    const globalParams = {
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      page_path: route.path, // We use route.path to ignore query params
      page_title: typeof document !== 'undefined' ? document.title : '',
      experiment_id: currentExperiment,
      experiment_group: experimentGroup
    }

    // Debug log in development
    if (import.meta.dev) {
      console.log('[GTM] Tracking event:', name, { ...globalParams, ...params })
    }

    proxy.dataLayer.push({
      event: name,
      ...globalParams,
      ...params
    })
  }

  const trackLogin = (method: string) => {
    trackEvent('login', {
      method
    })
  }

  /**
   * GA4 Recommended Event: select_content
   * Following user guide: content_type for category, content_id for specific action/label
   */
  const trackSelectContent = (contentType: string, contentId: string) => {
    trackEvent('select_content', {
      content_type: contentType,
      content_id: contentId
    })
  }

  /**
   * GA4 Recommended Event: view_search_results
   */
  const trackSearch = (searchTerm: string) => {
    trackEvent('view_search_results', {
      search_term: searchTerm
    })
  }

  const trackBeginCheckout = (items: { item_id: string, item_name?: string, price?: number, quantity?: number }[], currency: string = 'USD') => {
    const value = items.reduce((sum, item) => sum + (item.price ?? 0), 0)
    trackEvent('begin_checkout', {
      currency,
      value,
      items: items.map(item => ({
        item_id: item.item_id,
        item_name: item.item_name ?? item.item_id,
        price: item.price ?? 0,
        quantity: item.quantity ?? 1
      }))
    })
  }

  /**
   * @deprecated Use trackSelectContent instead
   */
  const trackButtonClick = (
    event: Event,
    category: string = 'button',
    label?: string
  ) => {
    const target = event.target as HTMLElement
    const buttonText
      = label || target.innerText || target.textContent || 'unknown'

    trackSelectContent(category, buttonText)
  }

  /**
   * @deprecated Use trackBeginCheckout instead
   */
  const trackPurchaseClick = (event: Event) => {
    trackButtonClick(event, 'buy')
  }

  return {
    trackEvent,
    trackLogin,
    trackSelectContent,
    trackSearch,
    trackBeginCheckout,
    trackButtonClick,
    trackPurchaseClick
  }
}
