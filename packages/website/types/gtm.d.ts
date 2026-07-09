declare global {
  interface Window {
    dataLayer: Array<Record<string, any>>
    gtag?: (...args: any[]) => void
  }
}

export {}
