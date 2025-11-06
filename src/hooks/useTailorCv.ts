'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/utils/apiClient'
import { useAnalysisStore } from '@/stores/analysis.store'

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
  const [tailoredCv, setTailoredCv] = useState<TailoredCVResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { originalCv, originalJd, currentAnalysis } = useAnalysisStore()

  const tailorCv = async (cvContent?: string, jdContent?: string) => {
    const cvToUse = cvContent || originalCv
    const jdToUse = jdContent || originalJd
    
    if (!cvToUse || !jdToUse) {
      setError('No analysis results available to tailor from.')
      return
    }

    setLoading(true)
    setError(null)
    setTailoredCv(null)

    try {
      const formData = new FormData()

      if (typeof cvToUse === 'string') {
        formData.append('cv_text', cvToUse)
      } else {
        formData.append('cv_file', cvToUse)
      }

      if (typeof jdToUse === 'string') {
        formData.append('job_text', jdToUse)
      } else {
        formData.append('job_file', jdToUse)
      }

      formData.append('analysis_result_id', currentAnalysis ? currentAnalysis.id.toString() : '');

      const response = await apiClient('/matcher/tailor-cv', {
        method: 'POST',
        body: formData,
      });

      console.log('API Response:', response);
      console.log('Has tailored_cv:', response.data?.results?.tailored_cv);
      setTailoredCv(response)
    } catch {
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
