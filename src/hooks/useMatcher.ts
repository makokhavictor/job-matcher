'use client'

import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useAnalysisStore } from '@/stores/analysis.store'
import type { AnalysisResults } from '@/stores/analysis.store'
import { useJobsStore } from '@/stores/jobs.store'
import { authService } from '@/lib/auth.service'

interface UploadState {
  cv: File | string | null
  jobDescription: File | string | null
  metadata: {
    cv?: { type: 'text' | 'url' | 'file' }
    jobDescription?: { type: 'text' | 'url' | 'file' }
  }
}

export function useMatcher() {
  const [uploadState, setUploadState] = useState<UploadState>({
    cv: null,
    jobDescription: null,
    metadata: {},
  })
  const [matchingJobId, setMatchingJobId] = useState<string | null>(null)

  const resetAnalysisStore = useAnalysisStore((state) => state.reset)
  const setAnalysisResult = useAnalysisStore((state) => state.setResults)
  const setOriginals = useAnalysisStore((state) => state.setOriginals)
  const fetchRecentAnalyses = useAnalysisStore((state) => state.fetchRecentAnalyses)
  const addJob = useJobsStore((state) => state.addJob)

  const currentJob = useJobsStore((state) =>
    matchingJobId ? state.jobs.get(matchingJobId) : undefined
  )

  const handledRef = useRef<string | null>(null)

  useEffect(() => {
    if (!currentJob || handledRef.current === matchingJobId) return

    if (currentJob.status === 'completed') {
      handledRef.current = matchingJobId
      const results = currentJob.results as Record<string, unknown> | undefined
      if (results && typeof results.match_score === 'number') {
        setAnalysisResult({ ...results, id: currentJob.resultId } as AnalysisResults)
        fetchRecentAnalyses()
      }
      toast.success('Analysis complete!')
    } else if (currentJob.status === 'failed') {
      handledRef.current = matchingJobId
      toast.error(currentJob.error ?? 'Analysis failed')
    }
  }, [currentJob, matchingJobId, setAnalysisResult, fetchRecentAnalyses])

  const handleFileUpload = async (
    type: 'cv' | 'jobDescription',
    fileOrText: File | string,
    onSuccess: () => void,
    metadata?: { type: 'text' | 'url' | 'file' },
  ) => {
    try {
      if (typeof fileOrText === 'string') {
        if (fileOrText.trim() === '') throw new Error('Input is empty.')
        setUploadState((prev) => ({
          ...prev,
          [type]: fileOrText,
          metadata: { ...prev.metadata, [type]: metadata || { type: 'text' } },
        }))
      } else {
        if (fileOrText.size > 10 * 1024 * 1024) throw new Error('File size exceeds 10MB limit')
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ]
        if (!allowedTypes.includes(fileOrText.type)) {
          throw new Error('Invalid file type. Please upload PDF, DOCX, or TXT files only.')
        }
        setUploadState((prev) => ({
          ...prev,
          [type]: fileOrText,
          metadata: { ...prev.metadata, [type]: { type: 'file' } },
        }))
      }

      const cv = type === 'cv' ? fileOrText : uploadState.cv
      const jobDescription = type === 'jobDescription' ? fileOrText : uploadState.jobDescription

      if (cv && jobDescription) {
        const auth = authService.getAuthData()
        if (!auth) throw new Error('Not authenticated')

        setOriginals(cv, jobDescription)

        const formData = new FormData()
        formData.append('user_id', String(auth.user.id))
        formData.append('user_email', auth.user.email)

        if (typeof cv === 'string') {
          formData.append(metadata?.type === 'url' && type === 'cv' ? 'cv_url' : 'cv_text', cv)
        } else {
          formData.append('cv_file', cv, cv.name)
        }

        const jdMeta = type === 'jobDescription' ? metadata : uploadState.metadata.jobDescription
        if (typeof jobDescription === 'string') {
          formData.append(jdMeta?.type === 'url' ? 'job_url' : 'job_text', jobDescription)
        } else {
          formData.append('job_file', jobDescription, jobDescription.name)
        }

        const response = await fetch('/api/matcher/match', {
          method: 'POST',
          headers: { Authorization: `Bearer ${auth.access_token}` },
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error ?? 'Failed to start analysis')
        }

        const { jobId } = await response.json()
        handledRef.current = null
        setMatchingJobId(jobId)
        addJob(jobId, 'matching')
      }

      onSuccess()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error processing input'
      toast.error(message)
    }
  }

  const resetAnalysis = () => {
    setUploadState({ cv: null, jobDescription: null, metadata: {} })
    setMatchingJobId(null)
    handledRef.current = null
    resetAnalysisStore()
    toast('All documents cleared')
  }

  return { handleFileUpload, resetAnalysis, matchingJobId }
}
