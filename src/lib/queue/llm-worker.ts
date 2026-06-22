import { Worker, Job } from 'bullmq'
import type IORedis from 'ioredis'
import { getRedisConnection } from './redis'
import { getEmailQueue } from './queues'
import type { LLMAnalysisJobData, EmailJobData } from './queues'

const PYTHON_API_URL = process.env.PYTHON_API_URL ?? 'http://localhost:8000'

/**
 * Publishes a status event to Redis pub/sub so the SSE endpoint can relay it.
 * Channel: job:{jobId}:status
 */
async function publishStatus(redis: IORedis, jobId: string, event: object) {
  await redis.publish(`job:${jobId}:status`, JSON.stringify(event))
}

export function startLLMWorker() {
  const connection = getRedisConnection()

  const worker = new Worker<LLMAnalysisJobData>(
    'llm-analysis',
    async (job: Job<LLMAnalysisJobData>) => {
      const { jobId, cvText, currentRole, targetRole, targetIndustry, seniority, accessToken, userId, userEmail } = job.data

      await publishStatus(connection, jobId, { event: 'active', data: { step: 'extracting_skills' } })

      // Call Python backend
      const formData = new URLSearchParams()
      formData.set('cv_text', cvText)
      if (currentRole) formData.set('current_role', currentRole)
      formData.set('target_role', targetRole)
      if (targetIndustry) formData.set('target_industry', targetIndustry)
      if (seniority) formData.set('seniority', seniority)

      await publishStatus(connection, jobId, { event: 'active', data: { step: 'mapping_industry' } })

      const response = await fetch(`${PYTHON_API_URL}/matcher/career-position`, {
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
        data: { reportId: data.result_id },
      })

      // Enqueue result-ready email
      const emailQueue = getEmailQueue()
      const emailJob: EmailJobData = {
        type: 'result-ready',
        userId,
        resultId: data.result_id,
        email: userEmail,
        score: data.result?.pivot_readiness_score ?? 0,
      }
      await emailQueue.add('result-ready', emailJob)

      return data
    },
    {
      connection,
      concurrency: 3,
    }
  )

  worker.on('failed', async (job) => {
    if (!job) return
    const { jobId } = job.data
    await publishStatus(connection, jobId, {
      event: 'failed',
      data: { message: 'Analysis failed. Please try again.' },
    })
  })

  console.log('[LLM Worker] Started, listening on llm-analysis queue')
  return worker
}
