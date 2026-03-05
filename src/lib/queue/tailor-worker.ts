import { Worker, Job } from 'bullmq'
import { getRedisConnection } from './redis'
import type { TailorJobData } from './queues'
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

async function publishStatus(jobId: string, event: object) {
  const redis = getRedisConnection()
  await redis.publish(`job:${jobId}:status`, JSON.stringify(event))
}

export function startTailorWorker() {
  const worker = new Worker<TailorJobData>(
    'tailor-cv',
    async (job: Job<TailorJobData>) => {
      const { jobId, userId, analysisResultId, cvText, jobText } = job.data

      await publishStatus(jobId, { event: 'active', data: { step: 'tailoring_cv' } })

      const formData = new URLSearchParams()
      formData.set('cv_text', cvText)
      formData.set('job_text', jobText)
      formData.set('analysis_result_id', analysisResultId)

      const response = await fetch(`${PYTHON_API_URL}/matcher/tailor-cv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })

      if (!response.ok) {
        const err = await response.text()
        throw new Error(`Python API error ${response.status}: ${err}`)
      }

      const data = await response.json()

      await publishStatus(jobId, {
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
    { connection: getWorkerConnectionOptions(), concurrency: 3 }
  )

  worker.on('failed', async (job) => {
    if (!job) return
    const { jobId, userId } = job.data
    await publishStatus(jobId, { event: 'failed', data: { message: 'CV tailoring failed. Please try again.' } })
    await createNotification({
      userId,
      type: 'tailor_failed',
      title: 'CV tailoring failed',
      message: 'Something went wrong tailoring your CV. Please try again.',
      data: {},
    })
  })

  console.log('[Tailor Worker] Started, listening on tailor-cv queue')
  return worker
}
