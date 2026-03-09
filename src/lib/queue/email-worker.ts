import { Worker, Job } from 'bullmq'
import type { EmailJobData } from './queues'
import { emailProvider } from '@/lib/email'
import { resultReadyTemplate, welcomeTemplate, weeklyDigestTemplate } from '@/lib/email/templates'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

function getWorkerConnectionOptions() {
  const url = process.env.REDIS_URL ?? 'redis://localhost:6379'
  try {
    const parsed = new URL(url)
    return { host: parsed.hostname, port: parseInt(parsed.port || '6379', 10), maxRetriesPerRequest: null as null }
  } catch {
    return { host: 'localhost', port: 6379, maxRetriesPerRequest: null as null }
  }
}

export function startEmailWorker() {
  const worker = new Worker<EmailJobData>(
    'email-digest',
    async (job: Job<EmailJobData>) => {
      const data = job.data

      if (data.type === 'result-ready') {
        const { html, text } = resultReadyTemplate({
          name: '',
          score: data.score,
          targetRole: 'your target role',
          reportUrl: `${APP_URL}/dashboard/career-position`,
        })
        await emailProvider.send({
          to: data.email,
          subject: 'Your Career Position Report is ready',
          html,
          text,
        })
      }

      if (data.type === 'welcome') {
        const { html, text } = welcomeTemplate({
          name: data.name,
          dashboardUrl: `${APP_URL}/dashboard`,
        })
        await emailProvider.send({
          to: data.email,
          subject: 'Start with your Career Position',
          html,
          text,
        })
      }

      if (data.type === 'weekly-digest') {
        const { html, text } = weeklyDigestTemplate({
          name: '',
          score: data.score,
          previousScore: data.previousScore,
          targetRole: 'your target role',
          actions: ['Update your CV with recent achievements', 'Target 3 relevant roles this week'],
          reportUrl: `${APP_URL}/dashboard/career-position`,
        })
        await emailProvider.send({
          to: data.email,
          subject: 'Your career position this week',
          html,
          text,
        })
      }
    },
    {
      connection: getWorkerConnectionOptions(),
      concurrency: 10,
    }
  )

  console.log('[Email Worker] Started, listening on email-digest queue')
  return worker
}
