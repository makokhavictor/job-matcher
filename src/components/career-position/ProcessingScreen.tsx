'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCareerPositionStore } from '@/stores/career-position.store'
import { useJobStatus } from '@/hooks/useJobStatus'
import { track, Events } from '@/lib/analytics'

const STEPS = [
  { key: 'extracting_skills', label: 'Extracting your experience' },
  { key: 'mapping_industry', label: 'Mapping to target role' },
  { key: 'calculating_score', label: 'Calculating Pivot Readiness' },
] as const

type StepKey = typeof STEPS[number]['key']

function getStepState(stepKey: StepKey, activeStep: StepKey | null, jobStatus: string): 'done' | 'active' | 'waiting' {
  const activeIdx = STEPS.findIndex(s => s.key === activeStep)
  const stepIdx = STEPS.findIndex(s => s.key === stepKey)
  if (jobStatus === 'completed') return 'done'
  if (activeIdx > stepIdx) return 'done'
  if (activeIdx === stepIdx) return 'active'
  return 'waiting'
}

export function ProcessingScreen({ jobId }: { jobId: string }) {
  const { jobStatus, activeStep, latestResult } = useCareerPositionStore()
  const router = useRouter()
  useJobStatus(jobId)

  useEffect(() => {
    if (jobStatus === 'completed' && latestResult) {
      track(Events.ANALYSIS_COMPLETED, { score: latestResult.score })
      setTimeout(() => router.push('/dashboard/career-position'), 800)
    }
  }, [jobStatus, latestResult, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 40, color: 'var(--foreground)' }}>
          Analyzing your career position...
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
          {STEPS.map((step) => {
            const state = getStepState(step.key, activeStep as StepKey | null, jobStatus)
            return (
              <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: state === 'done' ? 'var(--success)' : state === 'active' ? 'var(--accent)' : 'var(--accent-dim)',
                  transition: 'background 400ms',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 14,
                  color: state === 'waiting' ? 'var(--subtle)' : 'var(--foreground)',
                  transition: 'color 400ms',
                  flex: 1,
                }}>
                  {step.label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--subtle)' }}>
                  {state === 'done' ? '✓' : state === 'active' ? '◌' : '—'}
                </span>
              </div>
            )
          })}
        </div>

        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 32 }}>
          Usually takes 30–45 seconds.
        </p>

        {/* Blurred score placeholder */}
        <div style={{
          border: '1px solid var(--accent-dim)',
          borderRadius: 'var(--radius)',
          padding: '32px',
          textAlign: 'center',
          filter: jobStatus === 'completed' ? 'none' : 'blur(6px)',
          transition: 'filter 800ms',
          marginBottom: 32,
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 72, color: 'var(--foreground)', margin: 0 }}>
            {latestResult?.score ?? '—'}
          </p>
          <p style={{ fontSize: 12, color: 'var(--subtle)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 8 }}>
            PIVOT READINESS
          </p>
        </div>

        {jobStatus === 'failed' && (
          <p style={{ color: 'var(--destructive)', fontSize: 14 }}>
            Analysis failed. Please try again.
          </p>
        )}

        <div style={{ borderTop: '1px solid var(--accent-dim)', paddingTop: 20 }}>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            You can close this tab — we&apos;ll email you when your report is ready.
          </p>
        </div>
      </div>
    </div>
  )
}
