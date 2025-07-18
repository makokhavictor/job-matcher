'use client'

import { FileUpload } from '@/components/upload/FileUpload'
import { AnalysisResults } from '@/components/analysis/AnalysisResults'
import { Card } from '@/components/ui/card'
import { setupDOMPolyfills } from '@/lib/domPolyfills'
import { defineStepper } from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'
import { useMatcher } from '@/hooks/useMatcher'
import { useIsMobile } from '@/hooks/use-mobile'

// Initialize polyfills
setupDOMPolyfills()

const stepperSteps = [
  { id: 'cv', title: 'Resume/CV', description: 'Upload your resume/cv' },
  {
    id: 'jd',
    title: 'Job Description',
    description: 'Upload or paste the job description',
  },
  { id: 'results', title: 'Results', description: 'Analysis results' },
] as const

const stepperInstance = defineStepper(...stepperSteps)
const { Stepper } = stepperInstance

export function MatcherClient() {
  const { handleFileUpload, resetAnalysis } = useMatcher()
  const isMobile = useIsMobile()


  return (
    <>
      <Stepper.Provider
        className="space-y-4"
        variant={isMobile ? 'vertical' : 'horizontal'}
      >
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
                    onUploadComplete={(file) =>
                      handleFileUpload('cv', file, () => methods.next())
                    }
                  />
                </Card>
              ),
              jd: () => (
                <Card className="p-6">
                  <FileUpload
                    type="jobDescription"
                    onUploadComplete={(file) =>
                      handleFileUpload('jobDescription', file, () =>
                        methods.next(),
                      )
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
              <Button
                onClick={
                  methods.isLast
                    ? () => {
                        methods.reset()
                        resetAnalysis()
                      }
                    : methods.next
                }
              >
                {methods.isLast ? 'Reset' : 'Next'}
              </Button>
            </Stepper.Controls>
          </>
        )}
      </Stepper.Provider>
    </>
  )
}
