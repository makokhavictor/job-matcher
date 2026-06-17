'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCareerPositionStore } from '@/stores/career-position.store'
import { ScoreHero } from '@/components/career-position/ScoreHero'
import { TransferableSkills } from '@/components/career-position/TransferableSkills'
import { ProPaywall } from '@/components/career-position/ProPaywall'
import { ReportTooltipOverlay } from '@/components/career-position/ReportTooltipOverlay'
import { track, Events } from '@/lib/analytics'
import { useAuth } from '@/app/providers/auth-provider'

export default function CareerPositionPage() {
  const { latestResult, loading, fetchLatestResult } = useCareerPositionStore()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchLatestResult()
  }, [fetchLatestResult])

  useEffect(() => {
    if (latestResult) track(Events.REPORT_VIEWED, { score: latestResult.score })
  }, [latestResult])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--subtle)' }}>
          Retrieving your position...
        </p>
      </div>
    )
  }

  if (!latestResult) {
    router.push('/dashboard/career-position/onboarding')
    return null
  }

  const isPro = !!user?.subscription?.plan?.features?.advanced_match_scoring

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 80px' }}>
      <div style={{ paddingTop: 48, marginBottom: 8 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--subtle)' }}>
          {latestResult.target?.current_role ?? ''} → {latestResult.target?.target_role ?? 'Target Role'}
        </p>
      </div>

      <ScoreHero result={latestResult} />
      <TransferableSkills result={latestResult} />

      {isPro ? (
        <div style={{ borderTop: '1px solid var(--accent-dim)', paddingTop: 32, marginTop: 8 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--subtle)', marginBottom: 20 }}>
            CRITICAL GAPS
          </p>
          {latestResult.result_data.critical_gaps?.map((gap, i) => (
            <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid var(--surface)' }}>
              <p style={{ fontSize: 14, color: 'var(--foreground)', marginBottom: 4 }}>{gap.skill}</p>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{gap.why_matters}</p>
              <p style={{ fontSize: 12, color: 'var(--accent)', fontStyle: 'italic' }}>→ {gap.fastest_path}</p>
            </div>
          ))}
        </div>
      ) : (
        <ProPaywall />
      )}

      <ReportTooltipOverlay />
    </div>
  )
}
