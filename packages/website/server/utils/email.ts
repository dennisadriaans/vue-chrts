import type { EmailOptions } from '~~/types/EmailOptions'
import type { TrackingOptions } from '~~/types/TrackingOptions'
import type { EmailService } from '~~/types/EmailService'

export const createPlunkService = (): EmailService => {
  const config = useRuntimeConfig()
  const PLUNK_API_TOKEN = config.plunkApiToken || process.env.PLUNK_API_TOKEN
  const PLUNK_API_URL = 'https://api.useplunk.com/v1/send'
  const PLUNK_TRACK_API_URL = 'https://api.useplunk.com/v1/track'

  if (!PLUNK_API_TOKEN) {
    throw new Error(
      'Plunk API token is missing. Please provide it or set PLUNK_API_TOKEN in environment variables.'
    )
  }

  return {
    track: async (trackOptions: TrackingOptions): Promise<void> => {
      try {
        const contactData: Record<string, string> = {}
        if (trackOptions.firstName) {
          contactData.firstName = trackOptions.firstName
        }
        if (trackOptions.lastName) {
          contactData.lastName = trackOptions.lastName
        }

        await $fetch(PLUNK_TRACK_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PLUNK_API_TOKEN}`
          },
          body: {
            event: trackOptions.event,
            email: trackOptions.email,
            subscribed: trackOptions.subscribed,
            data: contactData
          }
        })
      } catch (error) {
        console.error('Failed to track event with Plunk:', error)
        throw new Error(
          'Event tracking failed with Plunk. Please check logs for details.'
        )
      }
    },

    send: async (emailOptions: EmailOptions): Promise<void> => {
      const { to, from, subject, text, html } = emailOptions

      if (!to || !from || (!text && !html)) {
        throw new Error(
          'Required email fields (to, from, text/html) are missing.'
        )
      }

      const payload = {
        from: from,
        to: to,
        subject: subject,
        body: html || text // Prioritize HTML over plain text
      }

      try {
        // Assuming $fetch is available globally or imported from a utility
        await $fetch(PLUNK_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PLUNK_API_TOKEN}`
          },
          body: payload
        })
        console.log('Email sent successfully via Plunk.')
      } catch (error) {
        console.error('Failed to send email with Plunk:', error)
        throw new Error(
          'Email sending failed with Plunk. Please check logs for details.'
        )
      }
    }
  }
}
