import { Worker, Job } from 'bullmq'
import type IORedis from 'ioredis'
import { getRedisConnection } from './redis'
import type { TailorJobData } from './queues'
import { createNotification } from '@/lib/notifications'

const PYTHON_API_URL = process.env.PYTHON_API_URL ?? 'http://localhost:8000'

/**
 * Publishes a status event to Redis pub/sub so the SSE endpoint can relay it.
 * Channel: job:{jobId}:status
 */
async function publishStatus(redis: IORedis, jobId: string, event: object) {
  await redis.publish(`job:${jobId}:status`, JSON.stringify(event))
}

export function startTailorWorker() {
  const connection = getRedisConnection()

  const worker = new Worker<TailorJobData>(
    'tailor-cv',
    async (job: Job<TailorJobData>) => {
      const { jobId, userId, analysisResultId, cvText, jobText, accessToken } = job.data

      await publishStatus(connection, jobId, { event: 'active', data: { step: 'tailoring_cv' } })

      const formData = new URLSearchParams()
      formData.set('cv_text', cvText)
      formData.set('job_text', jobText)
      formData.set('analysis_result_id', analysisResultId)

      const response = await fetch(`${PYTHON_API_URL}/matcher/tailor-cv`, {
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

      const data = await response.json()

      await publishStatus(connection, jobId, {
        event: 'completed',
        data: { tailoredCv: data.results?.tailored_cv },
      })

      await createNotification({
        userId,
        type: 'tailor_complete',
        title: 'Tailored CV ready',
        message: 'Your tailored CV has been generated.',
        data: { analysisId: parseInt(analysisResultId, 10) },
      })

      return data
    },
    { connection, concurrency: 3 }
  )

  worker.on('failed', async (job, err) => {
    if (!job) return
    console.error('[Tailor Worker] Job failed:', err)
    const { jobId, userId } = job.data
    try {
      await publishStatus(connection, jobId, { event: 'failed', data: { message: 'CV tailoring failed. Please try again.' } })
      await createNotification({
        userId,
        type: 'tailor_failed',
        title: 'CV tailoring failed',
        message: 'Something went wrong tailoring your CV. Please try again.',
        data: {},
      })
    } catch (notifyErr) {
      console.error('[Tailor Worker] Failed to send failure notification:', notifyErr)
    }
  })

  console.log('[Tailor Worker] Started, listening on tailor-cv queue')
  return worker
}
