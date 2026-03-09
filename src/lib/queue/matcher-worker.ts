import { Worker, Job } from 'bullmq'
import type IORedis from 'ioredis'
import { getRedisConnection } from './redis'
import type { MatcherJobData } from './queues'
import { createNotification } from '@/lib/notifications'

const PYTHON_API_URL = process.env.PYTHON_API_URL ?? 'http://localhost:8000'

/**
 * Publishes a status event to Redis pub/sub so the SSE endpoint can relay it.
 * Channel: job:{jobId}:status
 */
async function publishStatus(redis: IORedis, jobId: string, event: object) {
  await redis.publish(`job:${jobId}:status`, JSON.stringify(event))
}

export function startMatcherWorker() {
  const connection = getRedisConnection()

  const worker = new Worker<MatcherJobData>(
    'matcher-analysis',
    async (job: Job<MatcherJobData>) => {
      const { jobId, userId, cvText, jobText, accessToken } = job.data

      await publishStatus(connection, jobId, { event: 'active', data: { step: 'parsing_documents' } })

      const formData = new URLSearchParams()
      formData.set('cv_text', cvText)
      formData.set('job_text', jobText)

      await publishStatus(connection, jobId, { event: 'active', data: { step: 'analyzing_match' } })

      const response = await fetch(`${PYTHON_API_URL}/matcher/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData.toString(),
      })

      if (!response.ok) {
        const err = await response.text()
        throw new Error(`Python API error ${response.status}: ${err}`)
      }

      await publishStatus(connection, jobId, { event: 'active', data: { step: 'calculating_score' } })

      const data = await response.json()

      await publishStatus(connection, jobId, {
        event: 'completed',
        data: { resultId: data.result_id, results: data.results },
      })

      await createNotification({
        userId,
        type: 'match_complete',
        title: 'Analysis complete',
        message: `Your CV match analysis is ready.`,
        data: { analysisId: data.result_id, matchScore: data.results?.match_score },
      })

      return data
    },
    { connection, concurrency: 3 }
  )

  worker.on('failed', async (job, err) => {
    if (!job) return
    console.error('[Matcher Worker] Job failed:', err)
    const { jobId, userId } = job.data
    try {
      await publishStatus(connection, jobId, { event: 'failed', data: { message: 'Analysis failed. Please try again.' } })
      await createNotification({
        userId,
        type: 'match_failed',
        title: 'Analysis failed',
        message: 'Something went wrong. Please try again.',
        data: {},
      })
    } catch (notifyErr) {
      console.error('[Matcher Worker] Failed to send failure notification:', notifyErr)
    }
  })

  console.log('[Matcher Worker] Started, listening on matcher-analysis queue')
  return worker
}
