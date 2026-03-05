import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getTailorQueue } from '@/lib/queue/queues'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()

  const userId = parseInt((formData.get('user_id') as string) ?? '0', 10)
  const userEmail = (formData.get('user_email') as string) ?? ''
  const analysisResultId = (formData.get('analysis_result_id') as string) ?? ''
  const cvText = (formData.get('cv_text') as string) ?? ''
  const jobText = (formData.get('job_text') as string) ?? ''

  if (!cvText || !jobText) {
    return NextResponse.json({ error: 'cv_text and job_text are required' }, { status: 400 })
  }

  const jobId = randomUUID()
  const queue = getTailorQueue()

  await queue.add('tailor', { jobId, userId, userEmail, analysisResultId, cvText, jobText })

  return NextResponse.json({ jobId })
}
