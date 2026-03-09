'use client'
import { useState } from 'react'
import { useCareerPositionStore } from '@/stores/career-position.store'

const SENIORITY_OPTIONS = ['junior', 'mid', 'senior', 'lead', 'director']

interface Props {
  onSubmit: (data: {
    currentRole: string
    targetRole: string
    targetIndustry: string
    seniority: string
  }) => void
}

export function TargetRoleStep({ onSubmit }: Props) {
  const { savedTarget } = useCareerPositionStore()
  const [currentRole, setCurrentRole] = useState(savedTarget?.current_role ?? '')
  const [targetRole, setTargetRole] = useState(savedTarget?.target_role ?? '')
  const [targetIndustry, setTargetIndustry] = useState(savedTarget?.target_industry ?? '')
  const [seniority, setSeniority] = useState(savedTarget?.seniority ?? 'senior')
  const [hint, setHint] = useState<string | null>(null)
  const [intent, setIntent] = useState<'pivot' | 'opportunity'>('pivot')

  const copy = intent === 'pivot'
    ? {
        heading: 'Where do you want to go?',
        targetLabel: 'and I want to become a',
        targetPlaceholder: 'e.g. Product Manager',
        helperText: "Not sure of the exact title? Type your best guess — we'll help you find the right target.",
      }
    : {
        heading: 'What are you targeting?',
        targetLabel: "I'm targeting the role of",
        targetPlaceholder: 'e.g. Senior Sales Engineer',
        helperText: "Same title is fine. We'll show you how to position yourself for a better offer.",
      }

  const inputStyle = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--accent-dim)',
    outline: 'none',
    fontSize: 15,
    fontFamily: 'var(--font-body)',
    color: 'var(--foreground)',
    padding: '4px 0',
    width: '100%',
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
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--subtle)', marginBottom: 8 }}>
          STEP 2 OF 2
        </p>
        <div style={{ width: 32, height: 1, background: 'var(--accent-dim)', marginBottom: 24 }} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {(['pivot', 'opportunity'] as const).map((opt) => {
            const label = opt === 'pivot' ? 'Career Pivot' : 'Better Opportunity'
            const active = intent === opt
            return (
              <button
                key={opt}
                type="button"
                aria-pressed={active}
                onClick={() => setIntent(opt)}
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, color: 'var(--foreground)', marginBottom: 40 }}>
          {copy.heading}
        </h1>

        {savedTarget && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 24, letterSpacing: '0.06em' }}>
            Last used: {savedTarget.current_role} → {savedTarget.target_role}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 8 }}>I currently work as</p>
            <input
              style={inputStyle}
              placeholder="e.g. Sales Engineer"
              value={currentRole}
              onChange={e => setCurrentRole(e.target.value)}
            />
          </div>

          <div>
            <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 8 }}>{copy.targetLabel}</p>
            <input
              style={inputStyle}
              placeholder={copy.targetPlaceholder}
              value={targetRole}
              onChange={e => { setTargetRole(e.target.value); setHint(null) }}
            />
            {hint && <p style={{ fontSize: 12, color: 'var(--warning)', marginTop: 6 }}>{hint}</p>}
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 8 }}>in</p>
              <input
                style={inputStyle}
                placeholder="e.g. Fintech"
                value={targetIndustry}
                onChange={e => setTargetIndustry(e.target.value)}
              />
            </div>
            <div>
              <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 8 }}>at</p>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={seniority}
                onChange={e => setSeniority(e.target.value)}
              >
                {SENIORITY_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--accent-dim)', marginTop: 32, paddingTop: 20, marginBottom: 32 }}>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            {copy.helperText}
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!targetRole.trim()}
          style={{
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
            border: 'none',
            padding: '14px 28px',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: targetRole.trim() ? 'pointer' : 'not-allowed',
            opacity: targetRole.trim() ? 1 : 0.4,
            borderRadius: 'var(--radius)',
            float: 'right',
          }}
        >
          Analyze my position →
        </button>
      </div>
    </div>
  )
}
