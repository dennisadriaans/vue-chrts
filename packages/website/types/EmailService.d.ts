import type { EmailOptions } from './EmailOptions'

export interface EmailService {
  send(emailOptions: EmailOptions): Promise<void>
  track(trackOptions): Promise<void>
}
