'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers/auth-provider'
import { CVUploadStep } from '@/components/career-position/CVUploadStep'
import { TargetRoleStep } from '@/components/career-position/TargetRoleStep'
import { careerPositionService } from '@/lib/career-position.service'
import { useCareerPositionStore } from '@/stores/career-position.store'
import { track, Events } from '@/lib/analytics'

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { setJobId } = useCareerPositionStore()
  const [step, setStep] = useState<1 | 2>(1)
  const [cvText, setCvText] = useState('')

  const handleCVComplete = (text: string) => {
    track(Events.ONBOARDING_STARTED)
    setCvText(text)
    setStep(2)
  }

  const handleTargetSubmit = async (data: {
    currentRole: string
    targetRole: string
    targetIndustry: string
    seniority: string
  }) => {
    if (!user) return
    const jobId = await careerPositionService.enqueueAnalysis({
      cvText,
      currentRole: data.currentRole,
      targetRole: data.targetRole,
      targetIndustry: data.targetIndustry,
      seniority: data.seniority,
      userId: Number(user.id),
      userEmail: user.email,
    })
    track(Events.ANALYSIS_SUBMITTED, { targetRole: data.targetRole, seniority: data.seniority })
    setJobId(jobId)
    router.push(`/dashboard/career-position/processing?jobId=${jobId}`)
  }

  if (step === 1) return <CVUploadStep onComplete={handleCVComplete} />
  return <TargetRoleStep onSubmit={handleTargetSubmit} />
}
