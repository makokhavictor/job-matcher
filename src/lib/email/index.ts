import type { EmailProvider } from './types'
import { ConsoleEmailProvider } from './console-provider'
import { ResendEmailProvider } from './resend-provider'

export const emailProvider: EmailProvider =
  process.env.EMAIL_PROVIDER === 'resend'
    ? new ResendEmailProvider()
    : new ConsoleEmailProvider()

export type { EmailProvider, EmailOptions } from './types'
