interface TrackConversionParams {
  clientId: string
  transactionId: string
  value: number
  currency: string
  colorMode?: string
  sessionId?: string
  items?: { item_id: string, item_name?: string, price?: number, quantity?: number }[]
}

export async function trackConversion({
  clientId,
  transactionId,
  value,
  currency,
  colorMode,
  sessionId,
  items
}: TrackConversionParams) {
  const config = useRuntimeConfig()
  const measurementId = config.public.gaMeasurementId // From nuxt.config.ts
  const apiSecret = config.gaApiSecret // Will be added to runtimeConfig

  if (!apiSecret) {
    console.error('GA_API_SECRET is not configured. Conversion not tracked.')
    return
  }

  if (!clientId) {
    console.error('Client ID is missing. Conversion not tracked.')
    return
  }

  const eventPayload = {
    client_id: clientId,
    events: [
      {
        name: 'purchase',
        params: {
          transaction_id: transactionId,
          value: value,
          currency: currency,
          color_mode: colorMode,
          ga_session_id: sessionId,
          items: items ?? [
            {
              item_id: transactionId,
              item_name: 'Nuxt Charts License',
              price: value,
              quantity: 1
            }
          ]
        }
      }
    ]
  }

  try {
    const response = await $fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        body: JSON.stringify(eventPayload),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    // The Measurement Protocol API usually returns a 204 No Content response on success.
    // You might want to add more robust error handling based on the response if needed.
    if (
      response === undefined
      || (response as any)?.status === 204
      || (response as any)?.status === 200
    ) {
      // $fetch might return undefined for 204
      if (import.meta.dev) {
        console.log(
          'Successfully sent purchase event to Google Analytics for client:',
          clientId,
          'Transaction ID:',
          transactionId
        )
      }
    } else {
      console.error('Error sending event to Google Analytics:', response)
    }
  } catch (error) {
    console.error('Failed to send event to Google Analytics:', error)
    // It's important to catch this error so it doesn't break the webhook flow
  }
}
