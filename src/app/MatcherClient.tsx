'use client'

import { useState, useEffect, useCallback } from 'react'
import { FileUpload } from '@/components/upload/FileUpload'
import { AnalysisResults } from '@/components/analysis/AnalysisResults'
import { Card } from '@/components/ui/card'
import { MetricsService } from '@/lib/metrics/metricsService'
import { toast } from 'sonner'
import { setupDOMPolyfills } from '@/lib/domPolyfills'

// Initialize polyfills
setupDOMPolyfills()

interface UploadState {
  cv: File | string | null
  jobDescription: File | string | null
}

interface Analysis {
  id: string
  score: number
  createdAt: Date
  cv: {
    id: string
    filename: string
  }
  jobDescription: {
    id: string
    filename: string
  }
}

interface AnalysisError extends Error {
  code?: string
  details?: string
}

export function MatcherClient() {
  const [uploadState, setUploadState] = useState<UploadState>({
    cv: null,
    jobDescription: null,
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<null>(null)
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([])
  const [sessionStartTime] = useState<number>(Date.now())
  const [uploadsThisSession, setUploadsThisSession] = useState<number>(0)

  const metrics = MetricsService.getInstance()

  const loadRecentAnalyses = useCallback(async () => {
    try {
      const response = await fetch('/api/analyses')
      const analyses = await response.json()
      setRecentAnalyses(analyses)
      if (analyses.length > 0) {
        metrics.getUserEngagementMetrics().recentAnalysesViewRate++
      }
    } catch (error) {
      console.error('Error loading recent analyses:', error)
      metrics.trackError('dbErrors')
    }
  }, [metrics])

  useEffect(() => {
    const initializeSession = () => {
      // Load recent analyses on component mount
      loadRecentAnalyses()

      // Track session start
      const lastSessionTime = localStorage.getItem('lastSessionTime')
      if (lastSessionTime) {
        const isReturn =
          Date.now() - parseInt(lastSessionTime) > 24 * 60 * 60 * 1000
        if (isReturn) {
          metrics.getUserEngagementMetrics().returnRate++
        }
      }
      localStorage.setItem('lastSessionTime', Date.now().toString())
    }

    initializeSession()

    // Cleanup on unmount
    return () => {
      // Track session duration
      const sessionDuration = (Date.now() - sessionStartTime) / 1000 // in seconds
      metrics.getUserEngagementMetrics().averageTimeSpent =
        (metrics.getUserEngagementMetrics().averageTimeSpent +
          sessionDuration) /
        2
    }
  }, [loadRecentAnalyses, metrics, sessionStartTime])

  const handleFileUpload = async (
    type: keyof UploadState,
    fileOrText: File | string
  ) => {
    const uploadStartTime = performance.now()
    try {
      setUploadsThisSession((prev) => prev + 1)
      metrics.getUserEngagementMetrics().uploadsPerSession =
        uploadsThisSession + 1

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
          metrics.trackError('uploadErrors')
          throw new Error('File size exceeds 10MB limit')
        }

        // Validate file type
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]
        if (!allowedTypes.includes(fileOrText.type)) {
          metrics.trackError('uploadErrors')
          throw new Error(
            'Invalid file type. Please upload PDF or DOCX files only.'
          )
        }

        setUploadState((prev) => ({ ...prev, [type]: fileOrText }))
        metrics.trackUpload(type)
        metrics.trackDocument(fileOrText.size, fileOrText.type, true)
        metrics.trackApiResponse(performance.now() - uploadStartTime)
        console.log('File uploaded:', type, uploadState)
      }

      // If both inputs are provided, trigger analysis
      if (
        (type === 'cv' && uploadState.jobDescription) ||
        (type === 'jobDescription' && uploadState.cv)
      ) {
        await runAnalysis(
          type === 'cv' ? fileOrText : uploadState.cv!,
          type === 'jobDescription' ? fileOrText : uploadState.jobDescription!
        )
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error processing input'
      console.error('Upload error:', error)
      metrics.trackError('uploadErrors')
      toast.error(message)
    }
  }

  const runAnalysis = async (
    cv: File | string,
    jobDescription: File | string
  ) => {
    const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const serverAPIKey = process.env.NEXT_PUBLIC_BACKEND_API_KEY as string;

    let cvText = ''
    if (typeof cv === 'string') {
      cvText = cv
      if (
        !/(experience|education|skills|curriculum vitae|resume)/i.test(cvText)
      ) {
        toast.error(
          'The uploaded CV does not appear to be a valid CV. Please check your document.'
        )
        setIsAnalyzing(false)
        return
      }
    }

    try {
      setIsAnalyzing(true)
      toast.info('Analyzing documents...')

      const formData = new FormData()

      // Only one of these gets appended
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

      const response = await fetch(`${backendApiUrl}/match`, {
        method: 'POST',
        headers: {
          'X-API-Key': serverAPIKey,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to analyze documents')
      }

      const result = await response.json()

      // Handle result
      setAnalysisResult(result)
      // await loadRecentAnalyses()
      // metrics.trackAnalysis()
      // metrics.trackAnalysisResult(result)
      // metrics.getUserEngagementMetrics().analysisCompletionRate++
      // metrics.trackAnalysisTime(performance.now() - analysisStartTime)

      toast.success('Analysis complete!')
    } catch (error: unknown) {
      const analysisError = error as AnalysisError
      console.error('Analysis error:', analysisError)

      let errorMessage = 'Error analyzing documents'
      if (analysisError.code === 'TIMEOUT') {
        metrics.trackError('timeoutErrors')
        errorMessage = 'Analysis took too long. Please try again.'
      } else {
        metrics.trackError('analysisErrors')
      }

      toast.error(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setUploadState({ cv: null, jobDescription: null })
    setAnalysisResult(null)
    setIsAnalyzing(false)
    toast.info('All documents cleared')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-secondary-800">
            Upload Documents
          </h2>
          {(uploadState.cv || uploadState.jobDescription) && (
            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:ring-offset-2"
            >
              Reset
            </button>
          )}
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-secondary-800 mb-4">
            Your CV
          </h3>
          <FileUpload
            type="cv"
            onUploadComplete={(file) => handleFileUpload('cv', file)}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-secondary-800 mb-4">
            Job Description
          </h3>
          <FileUpload
            type="jobDescription"
            onUploadComplete={(file) =>
              handleFileUpload('jobDescription', file)
            }
          />
        </Card>

        {recentAnalyses.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-medium text-secondary-800 mb-4">
              Recent Analyses
            </h3>
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-secondary-800">
                      {analysis.cv.filename} ↔{' '}
                      {analysis.jobDescription.filename}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-primary">
                    {analysis.score}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-secondary-800">
          Analysis Results
        </h2>
        <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-4">
          {isAnalyzing ? (
            <Card className="p-6">
              <div className="text-center text-secondary-600">
                <p>Analyzing your documents...</p>
              </div>
            </Card>
          ) : analysisResult ? (
            <AnalysisResults result={analysisResult} />
          ) : (
            <Card className="p-6">
              <div className="text-center text-secondary-600">
                <p>
                  Upload your CV and a job description to see the analysis
                  results.
                </p>
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
