'use client'

import { useState, useEffect } from 'react'
import { FileUpload } from '@/components/upload/FileUpload'
import { AnalysisResults } from '@/components/analysis/AnalysisResults'
import { Card } from '@/components/ui/card'
import { MetricsService } from '@/lib/metrics/metricsService'
import { toast } from 'sonner'
import { setupDOMPolyfills } from '@/lib/domPolyfills'
import { defineStepper } from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useLoadingStore } from '@/stores/loading.store'
import { useAnalysisStore } from '@/stores/analysis.store'

// Initialize polyfills
setupDOMPolyfills()

interface UploadState {
  cv: File | string | null
  jobDescription: File | string | null
}

const stepperSteps = [
  { id: 'cv', title: 'Resume/CV', description: 'Upload your resume/cv' },
  {
    id: 'jd',
    title: 'Job Description',
    description: 'Upload or paste the job description',
  },
  { id: 'results', title: 'Results', description: 'Analysis results' }
] as const;


const stepperInstance = defineStepper(...stepperSteps);
const { Stepper } = stepperInstance;

type StepperMethods = ReturnType<typeof stepperInstance.useStepper>;

export function MatcherClient() {
  const [uploadState, setUploadState] = useState<UploadState>({
    cv: null,
    jobDescription: null,
  })
  const [sessionStartTime] = useState<number>(Date.now())
  const [uploadsThisSession, setUploadsThisSession] = useState<number>(0)

  const setLoading = useLoadingStore((state) => state.setLoading)
  const setAnalysisResult = useAnalysisStore((state) => state.setResults)

  const metrics = MetricsService.getInstance()

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

  // Mutation for running analysis
  const analysisMutation = useMutation({
    mutationFn: async ({ cv, jobDescription }: { cv: File | string, jobDescription: File | string }) => {
      const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL
      const serverAPIKey = process.env.NEXT_PUBLIC_BACKEND_API_KEY as string
      let cvText = ''
      if (typeof cv === 'string') {
        cvText = cv
        if (!/(experience|education|skills|curriculum vitae|resume)/i.test(cvText)) {
          throw new Error('The uploaded CV does not appear to be a valid CV. Please check your document.')
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
      const response = await fetch(`${backendApiUrl}/match`, {
        method: 'POST',
        headers: { 'X-API-Key': serverAPIKey },
        body: formData,
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to analyze documents')
      }
      return response.json()
    },
    onSuccess: (result) => {
      // If result.results is a stringified JSON, parse it
      let parsed = null
      try {
        parsed = typeof result.results === 'string' ? JSON.parse(result.results) : result.results
      } catch {
        parsed = null
      }
      if (parsed && typeof parsed.match_score === 'number') {
        setAnalysisResult(parsed)
      }
      setLoading(false)
      toast.success('Analysis complete!')
    },
    onError: (error: unknown) => {
      let errorMessage = 'Error analyzing documents'
      // Try to get error code if available
      const err = error as { code?: string }
      if (err?.code === 'TIMEOUT') {
        metrics.trackError('timeoutErrors')
        errorMessage = 'Analysis took too long. Please try again.'
      } else {
        metrics.trackError('analysisErrors')
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
    methods: StepperMethods
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
        setLoading(true)
        analysisMutation.mutate({
          cv: type === 'cv' ? fileOrText : uploadState.cv!,
          jobDescription: type === 'jobDescription' ? fileOrText : uploadState.jobDescription!
        })
      } 
      methods.next()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error processing input'
      console.error('Upload error:', error)
      metrics.trackError('uploadErrors')
      toast.error(message)
    }
  }

  // const handleReset = () => {
  //   setUploadState({ cv: null, jobDescription: null })
  //   setAnalysisResult(null)
  //   setIsAnalyzing(false)
  //   toast('All documents cleared')
  // }

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
                    onUploadComplete={(file) => handleFileUpload('cv', file, methods)}
                  />
                </Card>
              ),
              jd: () => (
                <Card className="p-6">
                  <FileUpload
                    type="jobDescription"
                    onUploadComplete={(file) =>
                      handleFileUpload('jobDescription', file, methods)
                    }
                  />
                </Card>
              ),
              results: () => (
                <section className="space-y-6">
                  <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-4">
                    <AnalysisResults />
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
