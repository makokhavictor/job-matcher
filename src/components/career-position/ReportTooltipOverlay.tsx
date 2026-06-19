'use client'
import { useState, useEffect } from 'react'

const TOOLTIPS = [
  { target: 'score', text: "This is your Fitted Readiness Score — we'll track it over time as you make progress." },
  { target: 'skills', text: "These are your transferable skills — things you've already done that map to your target role." },
  { target: 'paywall', text: 'Upgrade to see exactly what gaps to close and which roles to target first.' },
]

const SHOWN_KEY = 'career_report_tooltip_shown'

export function ReportTooltipOverlay() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem(SHOWN_KEY)) {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    if (step < TOOLTIPS.length - 1) {
      setStep(s => s + 1)
    } else {
      setVisible(false)
      localStorage.setItem(SHOWN_KEY, '1')
    }
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      background: 'var(--foreground)',
      color: 'var(--primary-foreground)',
      padding: '20px 24px',
      maxWidth: 320,
      borderRadius: 'var(--radius-lg)',
      zIndex: 100,
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    }}>
      <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{TOOLTIPS[step].text}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--subtle)' }}>
          {step + 1} / {TOOLTIPS.length}
        </span>
        <button
          onClick={dismiss}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'var(--primary-foreground)',
            padding: '6px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            cursor: 'pointer',
            borderRadius: 'var(--radius)',
          }}
        >
          {step < TOOLTIPS.length - 1 ? 'Next' : 'Got it'}
        </button>
      </div>
    </div>
  )
}
