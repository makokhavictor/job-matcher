'use client'
import { useEffect, useRef, useState } from 'react'
import type { CareerPositionResult } from '@/lib/career-position.service'

export function ScoreHero({ result }: { result: CareerPositionResult }) {
  const { pivot_readiness_score, score_context, score_breakdown } = result.result_data
  const [displayScore, setDisplayScore] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const duration = 1400
    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // cubic ease-out
      setDisplayScore(Math.round(eased * pivot_readiness_score))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [pivot_readiness_score])

  const bars = [
    { label: 'VOCABULARY', value: score_breakdown.vocabulary_alignment },
    { label: 'SKILLS', value: score_breakdown.skills_transfer },
    { label: 'NARRATIVE', value: score_breakdown.narrative_strength },
  ]

  return (
    <div style={{ padding: '48px 0 32px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 96,
          fontWeight: 400,
          lineHeight: 1,
          color: 'var(--foreground)',
          letterSpacing: '-0.02em',
        }}>
          {displayScore}
        </p>
        <div style={{ width: 120, height: 1, background: 'var(--accent-dim)', margin: '16px auto' }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--subtle)' }}>
          PIVOT READINESS
        </p>
        {score_context && (
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 12 }}>{score_context}</p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bars.map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--subtle)', width: 80, flexShrink: 0 }}>
              {label}
            </p>
            <div style={{ flex: 1, height: 3, background: 'var(--accent-dim)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${value}%`,
                background: 'var(--foreground)',
                transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
              }} />
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--foreground)', width: 28, textAlign: 'right' }}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
