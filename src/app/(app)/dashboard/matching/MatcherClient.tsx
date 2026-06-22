'use client'

import { FileUpload } from '@/components/upload/FileUpload'
import { AnalysisResults } from '@/components/analysis/AnalysisResults'
import { MatchingProgress } from '@/components/analysis/MatchingProgress'
import { setupDOMPolyfills } from '@/lib/domPolyfills'
import { defineStepper } from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'
import { useMatcher } from '@/hooks/useMatcher'
import { useJobsStore } from '@/stores/jobs.store'
import { useIsMobile } from '@/hooks/use-mobile'
import { FileText, Briefcase, BarChart2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'

setupDOMPolyfills()

const stepperSteps = [
  { id: 'cv', title: 'Resume / CV', description: 'Upload your resume or CV' },
  { id: 'jd', title: 'Job Description', description: 'Add the job you\'re targeting' },
  { id: 'results', title: 'Results', description: 'Your match analysis' },
] as const

const stepperInstance = defineStepper(...stepperSteps)
const { Stepper } = stepperInstance

const stepMeta = {
  cv: {
    icon: FileText,
    heading: 'Upload your Resume or CV',
    subheading: 'We\'ll parse your document to understand your experience, skills, and background.',
  },
  jd: {
    icon: Briefcase,
    heading: 'Add the Job Description',
    subheading: 'Paste the job description or enter the posting URL so we can analyze the role requirements.',
  },
  results: {
    icon: BarChart2,
    heading: 'Your Match Analysis',
    subheading: 'Here\'s how your profile aligns with this role — and how to close the gap.',
  },
}

export function MatcherClient() {
  const { handleFileUpload, resetAnalysis, matchingJobId } = useMatcher()
  const isMobile = useIsMobile()

  const matchingJob = useJobsStore((state) =>
    matchingJobId ? state.jobs.get(matchingJobId) : undefined
  )
  const isJobInFlight =
    matchingJob?.status === 'pending' || matchingJob?.status === 'active'

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Job Matcher</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload your CV and a job description to get a detailed compatibility analysis.
        </p>
      </div>

      <Stepper.Provider
        className="space-y-8"
        variant={isMobile ? 'vertical' : 'horizontal'}
      >
        {({ methods }) => {
          const currentStepId = methods.current.id as keyof typeof stepMeta
          const meta = stepMeta[currentStepId]
          const StepIcon = meta.icon

          return (
            <>
              {/* Step navigation */}
              <Stepper.Navigation>
                {methods.all.map((step) => (
                  <Stepper.Step
                    key={step.id}
                    of={step.id}
                    onClick={() => methods.goTo(step.id)}
                  >
                    <Stepper.Title className="text-foreground">{step.title}</Stepper.Title>
                    <Stepper.Description>{step.description}</Stepper.Description>
                  </Stepper.Step>
                ))}
              </Stepper.Navigation>

              {/* Step content area */}
              <div className="rounded-lg border border-border bg-card">
                {/* Step header */}
                {currentStepId !== 'results' && (
                  <div className="flex items-start gap-4 border-b border-border px-6 py-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10">
                      <StepIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-foreground">{meta.heading}</h2>
                      <p className="mt-0.5 text-sm text-muted-foreground">{meta.subheading}</p>
                    </div>
                  </div>
                )}

                {/* Step body */}
                <div className={currentStepId === 'results' ? '' : 'p-6'}>
                  {methods.switch({
                    cv: () => (
                      <FileUpload
                        type="cv"
                        onUploadComplete={(file, metadata) =>
                          handleFileUpload('cv', file, () => methods.next(), metadata)
                        }
                      />
                    ),
                    jd: () => (
                      <FileUpload
                        type="jobDescription"
                        onUploadComplete={(file, metadata) =>
                          handleFileUpload('jobDescription', file, () => methods.next(), metadata)
                        }
                      />
                    ),
                    results: () => (
                      <div className="h-[calc(100vh-20rem)] overflow-y-auto">
                        {/* Results header */}
                        <div className="flex items-start gap-4 border-b border-border px-6 py-5 sticky top-0 bg-card z-10">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10">
                            <StepIcon className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <h2 className="text-base font-semibold text-foreground">{meta.heading}</h2>
                            <p className="mt-0.5 text-sm text-muted-foreground">{meta.subheading}</p>
                          </div>
                        </div>
                        <div className="p-6">
                          {isJobInFlight && matchingJobId ? (
                            <MatchingProgress jobId={matchingJobId} />
                          ) : (
                            <AnalysisResults />
                          )}
                        </div>
                      </div>
                    ),
                  })}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div>
                  {!methods.isFirst && !methods.isLast && (
                    <Button
                      variant="ghost"
                      onClick={methods.prev}
                      className="text-muted-foreground"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Back
                    </Button>
                  )}
                </div>
                <div>
                  {methods.isLast ? (
                    <Button
                      variant="outline"
                      onClick={() => { methods.reset(); resetAnalysis() }}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Start over
                    </Button>
                  ) : (
                    <Button onClick={methods.next}>
                      Continue
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )
        }}
      </Stepper.Provider>
    </div>
  )
}
