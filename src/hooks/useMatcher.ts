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
  metadata: {
    cv?: { type: 'text' | 'url' | 'file' }
    jobDescription?: { type: 'text' | 'url' | 'file' }
  }
}

export function useMatcher() {
  const [uploadState, setUploadState] = useState<UploadState>({
    cv: null,
    jobDescription: null,
    metadata: {}
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
      metadata
    }: {
      cv: File | string
      jobDescription: File | string
      metadata: UploadState['metadata']
    }) => {
      let cvText = ''
      setAnalysisResult(null); // Reset analysis result before starting new analysis
      
      // Validate CV text if it's a string and not a URL
      if (typeof cv === 'string' && metadata.cv?.type === 'text') {
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
      
      // Handle CV based on type
      if (typeof cv === 'string') {
        if (metadata.cv?.type === 'url') {
          formData.append('cv_url', cv)
        } else {
          formData.append('cv_text', cv)
        }
      } else {
        formData.append('cv_file', cv, cv.name)
      }
      
      // Handle job description based on type
      if (typeof jobDescription === 'string') {
        if (metadata.jobDescription?.type === 'url') {
          formData.append('job_url', jobDescription)
        } else {
          formData.append('job_text', jobDescription)
        }
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
    type: 'cv' | 'jobDescription',
    fileOrText: File | string,
    onSuccess: () => void,
    metadata?: { type: 'text' | 'url' | 'file' },
  ) => {
    try {
      // Store both the content and its metadata
      if (typeof fileOrText === 'string') {
        // Handle string input (text or URL)
        if (fileOrText.trim() === '') {
          throw new Error('Input is empty.')
        }
        
        setUploadState((prev) => ({ 
          ...prev, 
          [type]: fileOrText,
          metadata: {
            ...prev.metadata,
            [type]: metadata || { type: 'text' } // Default to text if no metadata
          }
        }))
        
        console.log(`${metadata?.type || 'text'} uploaded:`, type, fileOrText.substring(0, 100))
      } else {
        // Handle file upload
        // Validate file size (10MB limit as per PRD)
        if (fileOrText.size > 10 * 1024 * 1024) {
          throw new Error('File size exceeds 10MB limit')
        }

        // Validate file type
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ]
        if (!allowedTypes.includes(fileOrText.type)) {
          throw new Error(
            'Invalid file type. Please upload PDF, DOCX, or TXT files only.',
          )
        }

        setUploadState((prev) => ({ 
          ...prev, 
          [type]: fileOrText,
          metadata: {
            ...prev.metadata,
            [type]: { type: 'file' }
          }
        }))
        
        console.log('File uploaded:', type, fileOrText.name)
      }

      // If both inputs are provided, trigger analysis
      if (
        (type === 'cv' && uploadState.jobDescription) ||
        (type === 'jobDescription' && uploadState.cv)
      ) {
        setLoading(true)
        
        // Prepare metadata for the mutation
        const newMetadata = {
          ...uploadState.metadata,
          [type]: metadata || { type: typeof fileOrText === 'string' ? 'text' : 'file' }
        }
        
        analysisMutation.mutate({
          cv: type === 'cv' ? fileOrText : uploadState.cv!,
          jobDescription:
            type === 'jobDescription'
              ? fileOrText
              : uploadState.jobDescription!,
          metadata: newMetadata
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
    setUploadState({ cv: null, jobDescription: null, metadata: {} })
    resetAnalysisStore()
    toast('All documents cleared')
  }

  return { handleFileUpload, resetAnalysis }
}