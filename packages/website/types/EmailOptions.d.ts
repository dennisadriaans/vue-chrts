export type EmailOptions = {
  from: string
  to: string | string[]
  subject: string
  subscribed?: boolean
  html?: string
  text?: string
}

export type EmailProvider = 'resend' | 'plunk' | 'sendgrid' | 'postmark'
