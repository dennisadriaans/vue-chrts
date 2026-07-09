import fs from 'fs'
import path from 'path'

const { plunkApiToken } = useRuntimeConfig()

export default defineEventHandler(async (_event) => {
  const results = []

  // Read contacts.json file
  const url = 'https://api.useplunk.com/v1/contacts'
  const contactsPath = path.resolve(process.cwd(), 'contacts.json')
  const contactsData = fs.readFileSync(contactsPath, 'utf-8')
  const { contacts } = JSON.parse(contactsData)

  for (const email of contacts) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${plunkApiToken}`
      },
      body: JSON.stringify({
        email,
        subscribed: true,
        data: {}
      })
    }
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      results.push({ email, status: 'success', data })
    } catch (error) {
      let reason = 'Unknown error'
      if (
        error
        && typeof error === 'object'
        && 'message' in error
        && typeof (error as { message?: unknown }).message === 'string'
      ) {
        reason = (error as { message: string }).message
      }
      results.push({
        email,
        status: 'error',
        reason
      })
    }
  }

  return {
    message: 'Subscription process completed.',
    results
  }
})
