'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const EXAMPLE = {
  transition: 'Marketing Manager → Growth Lead',
  score: 82,
  bars: [
    { label: 'VOCABULARY', value: 79 },
    { label: 'SKILLS', value: 71 },
    { label: 'NARRATIVE', value: 88 },
  ],
  transferable: [
    {
      your_experience: '4 years running multi-channel demand campaigns',
      maps_to: 'Growth experiment design and funnel ownership',
      relevance: 'high' as const,
    },
    {
      your_experience: 'Cross-functional launches with product and engineering',
      maps_to: 'Growth squad coordination and roadmap influence',
      relevance: 'high' as const,
    },
  ],
}

const RELEVANCE_COLOR = { high: 'var(--accent)', medium: 'var(--muted)', low: 'var(--subtle)' }

export function ReportPreview() {
  return (
    <section
      id="report"
      style={{
        padding: '96px 48px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--accent-dim)',
      }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 64 }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            The report
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 3.5vw, 48px)',
            fontWeight: 400,
            color: 'var(--foreground)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            maxWidth: 520,
          }}>
            Honest. Specific.<br />
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Actionable.</em>
          </h2>
        </motion.div>

        {/* Report mock */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            border: '1px solid var(--accent-dim)',
            background: 'var(--surface-raised)',
            overflow: 'hidden',
          }}
        >
          {/* Report header bar */}
          <div style={{
            padding: '16px 32px',
            borderBottom: '1px solid var(--accent-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--subtle)', textTransform: 'uppercase' }}>
              Sample report
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>
              {EXAMPLE.transition}
            </p>
          </div>

          <div style={{ padding: '40px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px 64px' }}
            className="report-grid"
          >
            {/* Score block */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 8 }}>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 96,
                  fontWeight: 400,
                  color: 'var(--foreground)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}>
                  {EXAMPLE.score}
                </p>
              </div>
              <div style={{ width: 80, height: 1, background: 'var(--accent-dim)', marginBottom: 12 }} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--subtle)', textTransform: 'uppercase', marginBottom: 28 }}>
                Pivot Readiness
              </p>

              {EXAMPLE.bars.map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--subtle)', width: 76, flexShrink: 0 }}>
                    {label}
                  </p>
                  <div style={{ flex: 1, height: 3, background: 'var(--accent-dim)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${value}%`, background: 'var(--accent)' }} />
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--foreground)', width: 24, textAlign: 'right' }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Transferable skills */}
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--subtle)', textTransform: 'uppercase', marginBottom: 24 }}>
                Transferable Skills
              </p>
              {EXAMPLE.transferable.map((skill, i) => (
                <div key={i} style={{ paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid var(--accent-dim)' }}>
                  <p style={{ fontSize: 13, color: 'var(--foreground)', marginBottom: 6, lineHeight: 1.5 }}>
                    {skill.your_experience}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
                    → {skill.maps_to}
                  </p>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: RELEVANCE_COLOR[skill.relevance],
                    border: `1px solid ${RELEVANCE_COLOR[skill.relevance]}`,
                    padding: '2px 6px',
                  }}>
                    {skill.relevance} relevance
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Locked critical gaps */}
          <div style={{
            borderTop: '1px solid var(--accent-dim)',
            padding: '0 32px',
            position: 'relative',
          }}>
            {/* Blurred content */}
            <div style={{ filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none', padding: '28px 0' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--subtle)', textTransform: 'uppercase', marginBottom: 20 }}>
                Critical Gaps
              </p>
              {[1, 2].map(i => (
                <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--accent-dim)' }}>
                  <p style={{ fontSize: 13, color: 'var(--foreground)', marginBottom: 4 }}>████████████████████████</p>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>████████████████████████████████████</p>
                  <p style={{ fontSize: 12, color: 'var(--accent)', fontStyle: 'italic' }}>→ ██████████████████████████</p>
                </div>
              ))}
            </div>

            {/* Lock overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'color-mix(in srgb, var(--surface-raised) 70%, transparent)',
              backdropFilter: 'blur(2px)',
            }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--subtle)', textTransform: 'uppercase', marginBottom: 12 }}>
                Pro report
              </p>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20, textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
                Critical gaps, fastest paths, and your strongest career narrative.
              </p>
              <Link
                href="/register"
                style={{
                  display: 'inline-block',
                  background: 'var(--foreground)',
                  color: 'var(--background)',
                  padding: '10px 24px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'opacity 200ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Unlock full report
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .report-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
