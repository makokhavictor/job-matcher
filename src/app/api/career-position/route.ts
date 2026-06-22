import { NextRequest, NextResponse } from 'next/server'
import { getLLMQueue } from '@/lib/queue/queues'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const cvText = formData.get('cv_text') as string
  const currentRole = (formData.get('current_role') as string) ?? ''
  const targetRole = formData.get('target_role') as string
  const targetIndustry = (formData.get('target_industry') as string) ?? ''
  const seniority = (formData.get('seniority') as string) ?? 'mid'
  const userId = parseInt((formData.get('user_id') as string) ?? '0', 10)
  const userEmail = (formData.get('user_email') as string) ?? ''

  if (!cvText || !targetRole) {
    return NextResponse.json({ error: 'cv_text and target_role are required' }, { status: 400 })
  }

  const jobId = randomUUID()
  const queue = getLLMQueue()

  await queue.add('analyze', {
    jobId,
    userId,
    userEmail,
    cvText,
    currentRole,
    targetRole,
    targetIndustry,
    seniority,
    accessToken: authHeader.replace('Bearer ', ''),
  })

  return NextResponse.json({ jobId })
}
