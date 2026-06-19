'use client'

import { motion } from 'framer-motion'

const signals = [
  {
    num: '01',
    name: 'Pivot Readiness Score',
    description: 'A single number from 0 to 100. Not vague feedback — a precise, defensible signal of your career move readiness.',
  },
  {
    num: '02',
    name: 'Skill Gap Mapping',
    description: 'Every gap between your CV and the target role — named, not euphemised.',
  },
  {
    num: '03',
    name: 'Transferable Skills',
    description: 'Hidden leverage in your existing experience, surfaced and ranked by relevance to the target role.',
  },
  {
    num: '04',
    name: 'Entry Point Discovery',
    description: 'The adjacent roles that accelerate your path. Move beyond your current tier intelligently.',
  },
  {
    num: '05',
    name: 'Strongest Narrative',
    description: 'Your career story, extracted and structured. The pitch that actually reflects your positioning.',
  },
  {
    num: '06',
    name: 'Progress Tracking',
    description: 'Retake the analysis as you update your CV. Watch your score move. Know what\'s working.',
  },
]

export function Features() {
  return (
    <section
      id="features"
      style={{
        padding: '96px 48px',
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
            What Pivot measures
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 400,
            color: 'var(--foreground)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}>
            Six signals.<br />
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>One number.</em>
          </h2>
        </motion.div>

        {/* 2-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderTop: '1px solid var(--accent-dim)',
          borderLeft: '1px solid var(--accent-dim)',
        }}
          className="features-grid"
        >
          {signals.map((signal, index) => (
            <motion.div
              key={signal.num}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 2) * 0.06 }}
              style={{
                padding: '36px',
                borderRight: '1px solid var(--accent-dim)',
                borderBottom: '1px solid var(--accent-dim)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 20,
                  fontWeight: 400,
                  color: 'var(--foreground)',
                  lineHeight: 1.2,
                }}>
                  {signal.name}
                </h3>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--muted)',
                  letterSpacing: '0.1em',
                  flexShrink: 0,
                  marginLeft: 16,
                }}>
                  {signal.num}
                </span>
              </div>
              <p style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: 'var(--muted)',
              }}>
                {signal.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
