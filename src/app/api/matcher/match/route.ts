import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getMatcherQueue } from '@/lib/queue/queues'

async function parseFileToText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  if (file.name.endsWith('.pdf')) {
    const pdfParse = (await import('pdf-parse-fork')).default
    const parsed = await pdfParse(buffer)
    return parsed.text
  }
  if (file.name.endsWith('.docx')) {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }
  return buffer.toString('utf-8')
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()

  const userId = parseInt((formData.get('user_id') as string) ?? '0', 10)
  const userEmail = (formData.get('user_email') as string) ?? ''

  // Resolve CV text
  let cvText = ''
  const cvFile = formData.get('cv_file') as File | null
  const cvTextRaw = formData.get('cv_text') as string | null
  if (cvFile) {
    cvText = await parseFileToText(cvFile)
  } else if (cvTextRaw) {
    cvText = cvTextRaw
  } else {
    return NextResponse.json({ error: 'cv_file or cv_text required' }, { status: 400 })
  }

  // Resolve JD text
  let jobText = ''
  const jobFile = formData.get('job_file') as File | null
  const jobTextRaw = formData.get('job_text') as string | null
  if (jobFile) {
    jobText = await parseFileToText(jobFile)
  } else if (jobTextRaw) {
    jobText = jobTextRaw
  } else {
    return NextResponse.json({ error: 'job_file or job_text required' }, { status: 400 })
  }

  const jobId = randomUUID()
  const queue = getMatcherQueue()

  await queue.add('match', { jobId, userId, userEmail, cvText, jobText })

  return NextResponse.json({ jobId })
}
