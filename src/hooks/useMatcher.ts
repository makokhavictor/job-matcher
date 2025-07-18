'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useLoadingStore } from '@/stores/loading.store'
import { useAnalysisStore } from '@/stores/analysis.store'
import { apiClient } from '@/lib/utils/apiClient'

interface UploadState {
  cv: File | string | null
  jobDescription: File | string | null
}

export function useMatcher() {
  const [uploadState, setUploadState] = useState<UploadState>({
    cv: null,
    jobDescription: null,
  })

  const setLoading = useLoadingStore((state) => state.setLoading)
  const resetAnalysisStore = useAnalysisStore((state) => state.reset)
  const setAnalysisResult = useAnalysisStore((state) => state.setResults)
  const fetchRecentAnalyses = useAnalysisStore(
    (state) => state.fetchRecentAnalyses,
  )


  // Mutation for running analysis
  const analysisMutation = useMutation({
    mutationFn: async ({
      cv,
      jobDescription,
    }: {
      cv: File | string
      jobDescription: File | string
    }) => {
      let cvText = ''
      if (typeof cv === 'string') {
        cvText = cv
        if (
          !/(experience|education|skills|curriculum vitae|resume)/i.test(cvText)
        ) {
          throw new Error(
            'The uploaded CV does not appear to be a valid CV. Please check your document.',
          )
        }
      }
      const formData = new FormData()
      if (typeof cv === 'string') {
        formData.append('cv_text', cv)
      } else {
        formData.append('cv_file', cv, cv.name)
      }
      if (typeof jobDescription === 'string') {
        formData.append('job_text', jobDescription)
      } else {
        formData.append('job_file', jobDescription, jobDescription.name)
      }
      // Use apiClient for the request
      // apiClient expects JSON by default, but we need to send FormData and custom headers
      // So we pass headers and body, and override Content-Type
      const response = await apiClient('/matcher/match', {
        method: 'POST',
        body: formData,
      })
      // apiClient throws on !ok, so no need for manual error check
      return response
    },
    onSuccess: (result) => {
      // If result.results is a stringified JSON, parse it
      let parsed = null
      try {
        parsed =
          typeof result.results === 'string'
            ? JSON.parse(result.results)
            : result.results
      } catch {
        parsed = null
      }
      if (parsed && typeof parsed.match_score === 'number') {
        setAnalysisResult(parsed)
        // Fire-and-forget refetch of recent analyses
        fetchRecentAnalyses()
      }
      setLoading(false)
      toast.success('Analysis complete!')
    },
    onError: (error: unknown) => {
      let errorMessage = 'Error analyzing documents'
      // Try to get error code if available
      const err = error as { code?: string; detail?: string; message?: string }
      if (err?.code === 'TIMEOUT') {
        errorMessage = 'Analysis took too long. Please try again.'
      } else if (err?.detail) {
        errorMessage = err.detail
      } else {
      }
      setLoading(false)
      toast.error(errorMessage)
    },
    onSettled: () => {
      setLoading(false)
    },
  })

  const handleFileUpload = async (
    type: keyof UploadState,
    fileOrText: File | string,
    onSuccess: () => void,
  ) => {
    try {
      if (typeof fileOrText === 'string') {
        // Handle pasted text
        if (fileOrText.trim() === '') {
          throw new Error('Pasted text is empty.')
        }
        setUploadState((prev) => ({ ...prev, [type]: fileOrText }))
        console.log('Text uploaded:', type, fileOrText)
      } else {
        // Validate file size (10MB limit as per PRD)
        if (fileOrText.size > 10 * 1024 * 1024) {
          throw new Error('File size exceeds 10MB limit')
        }

        // Validate file type
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]
        if (!allowedTypes.includes(fileOrText.type)) {
          throw new Error(
            'Invalid file type. Please upload PDF or DOCX files only.',
          )
        }

        setUploadState((prev) => ({ ...prev, [type]: fileOrText }))
        console.log('File uploaded:', type, uploadState)
      }

      // If both inputs are provided, trigger analysis
      if (
        (type === 'cv' && uploadState.jobDescription) ||
        (type === 'jobDescription' && uploadState.cv)
      ) {
        setLoading(true)
        analysisMutation.mutate({
          cv: type === 'cv' ? fileOrText : uploadState.cv!,
          jobDescription:
            type === 'jobDescription'
              ? fileOrText
              : uploadState.jobDescription!,
        })
      }
      onSuccess()
    } catch (error) {
        const message =
        error instanceof Error ? error.message : 'Error processing input'
      console.error('Upload error:', error)
      toast.error(message)
    }
  }

  const resetAnalysis = () => {
    setUploadState({ cv: null, jobDescription: null })
    resetAnalysisStore()
    toast('All documents cleared')
  }

  return { handleFileUpload, resetAnalysis }
}