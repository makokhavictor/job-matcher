import { Resend } from 'resend'
import type { EmailProvider, EmailOptions } from './types'

export class ResendEmailProvider implements EmailProvider {
  private client: Resend

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('RESEND_API_KEY env var is required')
    this.client = new Resend(apiKey)
  }

  async send(options: EmailOptions): Promise<void> {
    const from = process.env.EMAIL_FROM ?? 'noreply@yourdomain.com'
    await this.client.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })
  }
}
