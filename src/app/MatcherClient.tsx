'use client'

import { useState, useEffect, use } from 'react'
import { FileUpload } from '@/components/upload/FileUpload'
import { AnalysisResults } from '@/components/analysis/AnalysisResults'
import { Card } from '@/components/ui/card'
import { MetricsService } from '@/lib/metrics/metricsService'
import { toast } from 'sonner'
import { setupDOMPolyfills } from '@/lib/domPolyfills'
import { defineStepper } from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'

// Initialize polyfills
setupDOMPolyfills()

interface UploadState {
  cv: File | string | null
  jobDescription: File | string | null
}

// interface Analysis {
//   id: string
//   score: number
//   createdAt: Date
//   cv: {
//     id: string
//     filename: string
//   }
//   jobDescription: {
//     id: string
//     filename: string
//   }
// }

interface AnalysisError extends Error {
  code?: string
  details?: string
}

const { Stepper } = defineStepper(
  { id: 'cv', title: 'Resume/CV', description: 'Upload your resume/cv' },
  {
    id: 'jd',
    title: 'Job Description',
    description: 'Upload or paste the job description',
  },
  { id: 'results', title: 'Results', description: 'Analysis results' }
)

export function MatcherClient() {
  const [uploadState, setUploadState] = useState<UploadState>({
    cv: null,
    jobDescription: null,
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<null>(null)
  // const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([])
  const [sessionStartTime] = useState<number>(Date.now())
  const [uploadsThisSession, setUploadsThisSession] = useState<number>(0)

  const metrics = MetricsService.getInstance()

  // const loadRecentAnalyses = useCallback(async () => {
  //   try {
  //     const response = await fetch('/api/analyses')
  //     const analyses = await response.json()
  //     setRecentAnalyses(analyses)
  //     if (analyses.length > 0) {
  //       metrics.getUserEngagementMetrics().recentAnalysesViewRate++
  //     }
  //   } catch (error) {
  //     console.error('Error loading recent analyses:', error)
  //     metrics.trackError('dbErrors')
  //   }
  // }, [metrics])

  useEffect(() => {
    const initializeSession = () => {
      // Load recent analyses on component mount
      // loadRecentAnalyses()

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
  }, [metrics, sessionStartTime])

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
    const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL
    const serverAPIKey = process.env.NEXT_PUBLIC_BACKEND_API_KEY as string

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
    toast('All documents cleared')
  }

  return (
    <>
      <Stepper.Provider className="space-y-4" variant="horizontal">
        {({ methods }) => (
          <>
            <Stepper.Navigation>
              {methods.all.map((step) => (
                <Stepper.Step
                  key={step.id}
                  of={step.id}
                  onClick={() => methods.goTo(step.id)}
                >
                  <Stepper.Title>{step.title}</Stepper.Title>
                  <Stepper.Description>{step.description}</Stepper.Description>
                </Stepper.Step>
              ))}
            </Stepper.Navigation>
            {methods.switch({
              cv: () => (
                <Card className="p-6">
                  <FileUpload
                    type="cv"
                    onUploadComplete={(file) => handleFileUpload('cv', file)}
                  />
                </Card>
              ),
              jd: () => (
                <Card className="p-6">
                  <FileUpload
                    type="jobDescription"
                    onUploadComplete={(file) =>
                      handleFileUpload('jobDescription', file)
                    }
                  />
                </Card>
              ),
              results: () => (
                <section className="space-y-6">
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
                            Upload your CV and a job description to see the
                            analysis results.
                          </p>
                        </div>
                      </Card>
                    )}
                  </div>
                </section>
              ),
            })}
            <Stepper.Controls>
              {!methods.isLast && (
                <Button
                  variant="secondary"
                  onClick={methods.prev}
                  disabled={methods.isFirst}
                >
                  Previous
                </Button>
              )}
              <Button onClick={methods.isLast ? methods.reset : methods.next}>
                {methods.isLast ? 'Reset' : 'Next'}
              </Button>
            </Stepper.Controls>
          </>
        )}
      </Stepper.Provider>
    </>
  )
}
