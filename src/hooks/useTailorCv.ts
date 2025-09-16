'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers/auth-provider'
import { apiClient } from '@/lib/utils/apiClient'
import { useAnalysisStore } from '@/stores/analysis.store'

export interface TailoredCvResponse {
  results: {
    tailored_cv: {
      personal_info: {
        name: string | null
        email: string | null
        phone: string | null
        location: string | null
        linkedin: string | null
        github: string | null
      }
      summary: string | null
      skills: Array<{
        name: string
        level: string | null
        category: string | null
      }>
      experience: Array<{
        job_title: string | null
        company: string | null
        start_date: string | null
        end_date: string | null
        duration: string | null
        location: string | null
        description: string
        skills_used: string[]
        achievements: string[]
      }>
      education: Array<{
        degree: string | null
        field_of_study: string | null
        institution: string | null
        start_date: string | null
        end_date: string | null
        gpa: string | null
        location: string | null
        achievements: string[]
      }>
      certifications: Array<{
        title: string
        issuer: string | null
        issue_date: string | null
        expiration_date: string | null
        credential_id: string | null
        url: string | null
      }>
      projects: Array<{
        name: string
        description: string
        technologies: string[]
        achievements: string[]
      }>
      languages: Array<{
        name: string
        proficiency: string
      }>
      raw_text: string
    }
    original_cv: any
    tailoring_summary: any
    baseline_analysis: any
    target_job: any
    template_data: any
  }
  success: boolean
  message: string
}

export function useTailorCv() {
  const [tailoredCv, setTailoredCv] = useState<TailoredCvResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { originalCv, originalJd } = useAnalysisStore()
  const { token } = useAuth()

  const tailorCv = async () => {
    if (!originalCv || !originalJd) {
      setError('No analysis results available to tailor from.')
      return
    }

    setLoading(true)
    setError(null)
    setTailoredCv(null)

    try {
      const formData = new FormData()

      if (typeof originalCv === 'string') {
        formData.append('cv_text', originalCv)
      } else {
        formData.append('cv_file', originalCv)
      }

      if (typeof originalJd === 'string') {
        formData.append('job_text', originalJd)
      } else {
        formData.append('job_file', originalJd)
      }

      const response = await apiClient('/matcher/tailor-cv', {
        method: 'POST',
        body: formData,
      });

      console.log('API Response:', response);
      console.log('Has tailored_cv:', response.data?.results?.tailored_cv);
      setTailoredCv(response)
    } catch (err) {
      setError('Failed to tailor CV. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('Tailored CV state changed:', tailoredCv);
  }, [tailoredCv]);

  return { tailorCv, tailoredCv, loading, error }
}
