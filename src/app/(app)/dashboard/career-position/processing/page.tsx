'use client'
import { useSearchParams } from 'next/navigation'
import { ProcessingScreen } from '@/components/career-position/ProcessingScreen'

export default function ProcessingPage() {
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId') ?? ''
  return <ProcessingScreen jobId={jobId} />
}
