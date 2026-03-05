'use client'
import Link from 'next/link'
import { useAuth } from '@/app/providers/auth-provider'
import { useCareerPositionStore } from '@/stores/career-position.store'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { latestResult, fetchLatestResult, loading } = useCareerPositionStore()

  useEffect(() => {
    fetchLatestResult()
  }, [fetchLatestResult])

  if (loading) return null

  // Empty state — no reports yet
  if (!latestResult) {
    return (
      <div style={{ maxWidth: 560, margin: '80px auto', padding: '0 24px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--subtle)', marginBottom: 16 }}>
          WHERE DO YOU STAND?
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, lineHeight: 1.3, color: 'var(--foreground)', marginBottom: 20 }}>
          Most professionals don&apos;t know how competitive they are for the roles they actually want.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32 }}>
          Your Career Position Report tells you exactly — in 60 seconds.
        </p>
        <Link
          href="/dashboard/career-position/onboarding"
          style={{
            display: 'inline-block',
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
            padding: '14px 28px',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: 'var(--radius)',
          }}
        >
          Analyze my position
        </Link>

        <div style={{ borderTop: '1px solid var(--accent-dim)', marginTop: 48, paddingTop: 32 }}>
          <p style={{ fontSize: 12, color: 'var(--subtle)', fontStyle: 'italic', marginBottom: 8 }}>
            Example: Sarah, 6 years in finance → Pivot Readiness 71 for Fintech PM
          </p>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            &ldquo;I had no idea I was already 70% there&rdquo;
          </p>
        </div>
      </div>
    )
  }

  // Post-report hub
  const r = latestResult.result_data
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px 24px 80px' }}>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 4 }}>
        Good morning, {user?.name?.split(' ')[0]}.
      </p>

      <div style={{ borderTop: '1px solid var(--accent-dim)', borderBottom: '1px solid var(--accent-dim)', padding: '24px 0', margin: '20px 0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 56, fontWeight: 400, color: 'var(--foreground)', lineHeight: 1 }}>
            {r.pivot_readiness_score}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--subtle)' }}>
            PIVOT READINESS
          </p>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>
          {latestResult.target?.current_role ?? 'Your role'} → {latestResult.target?.target_role ?? 'Target'}
        </p>
      </div>

      <Link
        href="/dashboard/career-position/onboarding"
        style={{
          display: 'inline-block',
          border: '1px solid var(--accent-dim)',
          padding: '10px 20px',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          color: 'var(--foreground)',
          borderRadius: 'var(--radius)',
          marginBottom: 48,
        }}
      >
        Update CV and re-analyze
      </Link>

      <Link
        href="/dashboard/career-position"
        style={{
          display: 'block',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          letterSpacing: '0.08em',
          color: 'var(--accent)',
          textDecoration: 'none',
          marginTop: -24,
          marginBottom: 48,
        }}
      >
        View full report →
      </Link>
    </div>
  )
}
