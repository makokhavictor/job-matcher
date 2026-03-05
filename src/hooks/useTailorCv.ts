'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useAnalysisStore } from '@/stores/analysis.store'
import { useJobsStore } from '@/stores/jobs.store'
import { authService } from '@/lib/auth.service'

export interface TailoredCVResponse {
  results: {
    original_cv: string
    tailored_cv: TailoredCV
    job_description: string
  }
  success: boolean
  message: string
}

export interface TailoredCV {
  summary: string
  match_score: number
  alignment_reasoning: string
  personal_information: PersonalInformation
  experience: Experience[]
  projects: Project[]
  education: Education[]
  certifications: Certification[]
  skills: Skills
  soft_skills: string[]
}

export interface PersonalInformation {
  name: string
  location: string | null
  email: string | null
  phone: string | null
  linkedin: string | null
  portfolio: string | null
  github: string | null
}

export interface Experience {
  title: string
  company: string
  location: string | null
  dates: string | null
  description: string
}

export interface Project {
  name: string
  organization: string | null
  dates: string | null
  description: string
  technologies: string[]
}

export interface Education {
  degree: string
  institution: string
  location: string | null
  dates: string | null
}

export interface Certification {
  name: string
  issuer: string | null
  date: string | null
}

export interface Skills {
  languages: string[]
  frontend: string[]
  backend: string[]
  data_engineering: string[]
  devops: string[]
  ai_ml: string[]
  tools: string[]
  databases: string[]
  cloud: string[]
  project_management: string[]
}

export function useTailorCv() {
  const [tailoringJobId, setTailoringJobId] = useState<string | null>(null)

  const { originalCv, originalJd, results, currentAnalysis } = useAnalysisStore()
  const addJob = useJobsStore((state) => state.addJob)

  const currentJob = useJobsStore((state) =>
    tailoringJobId ? state.jobs.get(tailoringJobId) : undefined
  )

  const loading = currentJob?.status === 'pending' || currentJob?.status === 'active'
  const error = currentJob?.status === 'failed' ? (currentJob.error ?? 'Failed to tailor CV') : null

  const tailoredCv: TailoredCVResponse | null =
    currentJob?.status === 'completed' && currentJob.tailoredCv
      ? {
          results: {
            original_cv: '',
            tailored_cv: currentJob.tailoredCv as unknown as TailoredCV,
            job_description: '',
          },
          success: true,
          message: 'CV tailored successfully',
        }
      : null

  const tailorCv = async (cvContent?: string, jdContent?: string) => {
    const cvToUse = cvContent ?? (typeof originalCv === 'string' ? originalCv : null)
    const jdToUse = jdContent ?? (typeof originalJd === 'string' ? originalJd : null)

    if (!cvToUse || !jdToUse) {
      toast.error('No content available to tailor from.')
      return
    }

    const auth = authService.getAuthData()
    if (!auth) {
      toast.error('Not authenticated')
      return
    }

    try {
      const formData = new FormData()
      formData.append('cv_text', cvToUse)
      formData.append('job_text', jdToUse)
      formData.append(
        'analysis_result_id',
        results?.id?.toString() ?? currentAnalysis?.id?.toString() ?? ''
      )
      formData.append('user_id', String(auth.user.id))
      formData.append('user_email', auth.user.email)

      const response = await fetch('/api/matcher/tailor-cv', {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.access_token}` },
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to start tailoring job')
      }

      const { jobId } = await response.json()
      setTailoringJobId(jobId)
      addJob(jobId, 'tailoring')
    } catch {
      toast.error('Failed to tailor CV. Please try again.')
    }
  }

  return { tailorCv, tailoredCv, loading, error, tailoringJobId }
}
