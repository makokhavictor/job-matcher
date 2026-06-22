'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProcessingScreen } from '@/components/career-position/ProcessingScreen'

function ProcessingInner() {
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId') ?? ''
  return <ProcessingScreen jobId={jobId} />
}

export default function ProcessingPage() {
  return (
    <Suspense>
      <ProcessingInner />
    </Suspense>
  )
}
