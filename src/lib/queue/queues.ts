import { Queue } from 'bullmq'
import { getRedisConnection } from './redis'

export type LLMAnalysisJobData = {
  jobId: string
  userId: number
  userEmail: string
  cvText: string
  currentRole: string
  targetRole: string
  targetIndustry: string
  seniority: string
  accessToken: string
}

export type EmailJobData =
  | { type: 'result-ready'; userId: number; resultId: number; email: string; score: number }
  | { type: 'welcome'; userId: number; email: string; name: string }
  | { type: 'weekly-digest'; userId: number; email: string; score: number; previousScore: number | null }

let llmQueue: Queue<LLMAnalysisJobData> | null = null
let emailQueue: Queue<EmailJobData> | null = null

export function getLLMQueue(): Queue<LLMAnalysisJobData> {
  if (!llmQueue) {
    llmQueue = new Queue<LLMAnalysisJobData>('llm-analysis', {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    })
  }
  return llmQueue
}

export function getEmailQueue(): Queue<EmailJobData> {
  if (!emailQueue) {
    emailQueue = new Queue<EmailJobData>('email-digest', {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    })
  }
  return emailQueue
}
