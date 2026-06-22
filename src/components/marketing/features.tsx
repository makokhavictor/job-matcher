'use client'

import { motion } from 'framer-motion'

const signals = [
  {
    num: '01',
    name: 'Tailored CV',
    description: 'A complete rewrite of your CV, optimised for this specific role. Download and send.',
  },
  {
    num: '02',
    name: 'Match score',
    description: 'A precise 0–100 measure of fit between your experience and the role. Not vague feedback — a defensible number.',
  },
  {
    num: '03',
    name: 'Skill gap mapping',
    description: 'Every gap between your CV and the JD, named clearly. No euphemisms.',
  },
  {
    num: '04',
    name: 'Transferable skills',
    description: 'Hidden leverage in your existing experience, surfaced and ranked by relevance to this role.',
  },
  {
    num: '05',
    name: 'Entry point discovery',
    description: "The adjacent roles that accelerate your path if this one isn't quite ready yet.",
  },
  {
    num: '06',
    name: 'Strongest narrative',
    description: 'Your career story, extracted and structured for this application.',
  },
  {
    num: '07',
    name: 'Progress tracking',
    description: "Retake the analysis as you update your CV. Watch your score move. Know what's working.",
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
            What Fitted delivers
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 400,
            color: 'var(--foreground)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}>
            Seven outputs.<br />
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>One application.</em>
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
