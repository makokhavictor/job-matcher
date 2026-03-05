import { Worker, Job } from 'bullmq'
import type IORedis from 'ioredis'
import { getRedisConnection } from './redis'
import type { MatcherJobData } from './queues'
import { createNotification } from '@/lib/notifications'

const PYTHON_API_URL = process.env.PYTHON_API_URL ?? 'http://localhost:8000'

function getWorkerConnectionOptions() {
  const url = process.env.REDIS_URL ?? 'redis://localhost:6379'
  try {
    const parsed = new URL(url)
    return { host: parsed.hostname, port: parseInt(parsed.port || '6379', 10), maxRetriesPerRequest: null as null }
  } catch {
    return { host: 'localhost', port: 6379, maxRetriesPerRequest: null as null }
  }
}

/**
 * Publishes a status event to Redis pub/sub so the SSE endpoint can relay it.
 * Channel: job:{jobId}:status
 */
async function publishStatus(redis: IORedis, jobId: string, event: object) {
  await redis.publish(`job:${jobId}:status`, JSON.stringify(event))
}

export function startMatcherWorker() {
  const pubSubConnection = getRedisConnection()

  const worker = new Worker<MatcherJobData>(
    'matcher-analysis',
    async (job: Job<MatcherJobData>) => {
      const { jobId, userId, cvText, jobText } = job.data

      await publishStatus(pubSubConnection, jobId, { event: 'active', data: { step: 'parsing_documents' } })

      const formData = new URLSearchParams()
      formData.set('cv_text', cvText)
      formData.set('job_text', jobText)

      await publishStatus(pubSubConnection, jobId, { event: 'active', data: { step: 'analyzing_match' } })

      const response = await fetch(`${PYTHON_API_URL}/matcher/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })

      if (!response.ok) {
        const err = await response.text()
        throw new Error(`Python API error ${response.status}: ${err}`)
      }

      await publishStatus(pubSubConnection, jobId, { event: 'active', data: { step: 'calculating_score' } })

      const data = await response.json()

      await publishStatus(pubSubConnection, jobId, {
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
    { connection: getWorkerConnectionOptions(), concurrency: 3 }
  )

  worker.on('failed', async (job) => {
    if (!job) return
    const { jobId, userId } = job.data
    await publishStatus(pubSubConnection, jobId, { event: 'failed', data: { message: 'Analysis failed. Please try again.' } })
    await createNotification({
      userId,
      type: 'match_failed',
      title: 'Analysis failed',
      message: 'Something went wrong. Please try again.',
      data: {},
    })
  })

  console.log('[Matcher Worker] Started, listening on matcher-analysis queue')
  return worker
}
