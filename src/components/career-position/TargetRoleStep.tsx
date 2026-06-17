'use client'
import { useState } from 'react'
import { useCareerPositionStore } from '@/stores/career-position.store'

const SENIORITY_OPTIONS = ['junior', 'mid', 'senior', 'lead', 'director'] as const

interface Props {
  onSubmit: (data: {
    currentRole: string
    targetRole: string
    targetIndustry: string
    seniority: string
  }) => void
  onBack?: () => void
}

export function TargetRoleStep({ onSubmit, onBack }: Props) {
  const { savedTarget } = useCareerPositionStore()

  const hasSavedTarget = !!(savedTarget?.current_role || savedTarget?.target_role)

  const [currentRole, setCurrentRole] = useState(savedTarget?.current_role ?? '')
  const [targetRole, setTargetRole] = useState(savedTarget?.target_role ?? '')
  const [targetIndustry, setTargetIndustry] = useState(savedTarget?.target_industry ?? '')
  const [seniority, setSeniority] = useState<string>(savedTarget?.seniority ?? 'senior')
  const [hint, setHint] = useState<string | null>(null)
  const [intent, setIntent] = useState<'change' | 'advance'>('change')
  const [dismissedBanner, setDismissedBanner] = useState(false)

  const copy = intent === 'change'
    ? {
        currentLabel: 'I currently work as',
        targetLabel: 'and I want to move into',
        targetPlaceholder: 'e.g. Product Manager',
        helper: "Not sure of the exact title? Type your best guess — we'll help map the gap.",
      }
    : {
        currentLabel: 'I currently work as',
        targetLabel: 'and I\'m targeting',
        targetPlaceholder: 'e.g. Senior Sales Engineer',
        helper: "Same title is fine. We'll show you how to position for a stronger offer.",
      }

  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--accent-dim)',
    outline: 'none',
    fontSize: 16,
    fontFamily: 'var(--font-body)',
    color: 'var(--foreground)',
    padding: '6px 0',
    width: '100%',
    transition: 'border-color 150ms',
  }

  const handleSubmit = () => {
    if (!targetRole.trim()) return
    if (targetRole.trim().length < 4) {
      setHint('Could you be more specific? e.g. Product Manager, UX Designer, Data Analyst.')
      return
    }
    onSubmit({ currentRole, targetRole, targetIndustry, seniority })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* Progress track */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
          <div style={{ flex: 1, height: 2, background: 'var(--foreground)' }} />
          <div style={{ flex: 1, height: 2, background: 'var(--foreground)' }} />
        </div>

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--subtle)' }}>
            Step 2 of 2 — Your target
          </p>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
                textDecorationColor: 'var(--accent-dim)',
              }}
            >
              ← Change CV
            </button>
          )}
        </div>

        {/* Pre-fill notice */}
        {hasSavedTarget && !dismissedBanner && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--surface)',
            border: '1px solid var(--accent-dim)',
            borderRadius: 'var(--radius)',
            padding: '8px 12px',
            marginBottom: 24,
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>
              Pre-filled from your last analysis
            </p>
            <button
              type="button"
              onClick={() => {
                setCurrentRole('')
                setTargetRole('')
                setTargetIndustry('')
                setSeniority('senior')
                setDismissedBanner(true)
              }}
              style={{ background: 'none', border: 'none', color: 'var(--subtle)', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: '0 2px' }}
              aria-label="Clear pre-filled values"
            >
              ×
            </button>
          </div>
        )}

        {/* Intent toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {([
            { key: 'change', label: 'Switching fields' },
            { key: 'advance', label: 'Moving up' },
          ] as const).map(({ key, label }) => {
            const active = intent === key
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setIntent(key)}
                style={{
                  padding: '6px 16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '1px solid',
                  borderColor: active ? 'var(--foreground)' : 'var(--accent-dim)',
                  borderRadius: 'var(--radius)',
                  background: active ? 'var(--foreground)' : 'transparent',
                  color: active ? 'var(--background)' : 'var(--muted)',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 400, color: 'var(--foreground)', marginBottom: 36, lineHeight: 1.2 }}>
          {intent === 'change' ? 'Where do you want to go?' : 'What are you targeting?'}
        </h1>

        {/* Form fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Current role */}
          <div>
            <label style={{ display: 'block', fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
              {copy.currentLabel}
            </label>
            <input
              style={inputStyle}
              placeholder="e.g. Sales Engineer"
              value={currentRole}
              onChange={e => setCurrentRole(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Target role */}
          <div>
            <label style={{ display: 'block', fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
              {copy.targetLabel}
            </label>
            <input
              style={inputStyle}
              placeholder={copy.targetPlaceholder}
              value={targetRole}
              onChange={e => { setTargetRole(e.target.value); setHint(null) }}
              autoComplete="off"
            />
            {hint && (
              <p style={{ fontSize: 12, color: 'var(--warning)', marginTop: 6 }}>{hint}</p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label style={{ display: 'block', fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
              Target industry <span style={{ color: 'var(--subtle)', fontSize: 12 }}>(optional)</span>
            </label>
            <input
              style={inputStyle}
              placeholder="e.g. Fintech, Healthcare, SaaS"
              value={targetIndustry}
              onChange={e => setTargetIndustry(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Seniority pills */}
          <div>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>
              Seniority level
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SENIORITY_OPTIONS.map(s => {
                const active = seniority === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeniority(s)}
                    style={{
                      padding: '7px 16px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      border: '1px solid',
                      borderColor: active ? 'var(--foreground)' : 'var(--accent-dim)',
                      borderRadius: 'var(--radius)',
                      background: active ? 'var(--foreground)' : 'transparent',
                      color: active ? 'var(--background)' : 'var(--muted)',
                      cursor: 'pointer',
                      transition: 'all 150ms',
                    }}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Helper text + submit */}
        <div style={{ borderTop: '1px solid var(--accent-dim)', marginTop: 36, paddingTop: 20 }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
            {copy.helper}
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSubmit}
              disabled={!targetRole.trim()}
              style={{
                background: targetRole.trim() ? 'var(--primary)' : 'transparent',
                color: targetRole.trim() ? 'var(--primary-foreground)' : 'var(--subtle)',
                border: '1px solid',
                borderColor: targetRole.trim() ? 'var(--primary)' : 'var(--accent-dim)',
                padding: '13px 28px',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: targetRole.trim() ? 'pointer' : 'not-allowed',
                borderRadius: 'var(--radius)',
                transition: 'all 150ms',
              }}
            >
              Analyze my position →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
