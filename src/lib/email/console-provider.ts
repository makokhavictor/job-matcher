import type { EmailProvider, EmailOptions } from './types'

export class ConsoleEmailProvider implements EmailProvider {
  async send(options: EmailOptions): Promise<void> {
    console.log('\n========== EMAIL (console) ==========')
    console.log(`TO:      ${options.to}`)
    console.log(`SUBJECT: ${options.subject}`)
    console.log(`HTML:\n${options.html}`)
    console.log('=====================================\n')
  }
}
