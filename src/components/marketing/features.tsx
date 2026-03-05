'use client'

import { motion } from 'framer-motion'

const features = [
  {
    num: '01',
    name: 'Pivot Readiness Score',
    description:
      'A single number from 0 to 100. Not vague feedback — a precise, defensible signal of how ready you are to make the career move you are planning.',
  },
  {
    num: '02',
    name: 'Skill Gap Mapping',
    description:
      'We extract what your CV actually demonstrates and map it against the target role requirements. Every gap is named, not euphemised.',
  },
  {
    num: '03',
    name: 'Transferable Skills',
    description:
      'Skills that cross industry boundaries are surfaced and ranked. Find hidden leverage in your existing experience that standard job searching ignores.',
  },
  {
    num: '04',
    name: 'Entry Point Discovery',
    description:
      'Identify the realistic intermediate steps to your target role. Stop applying to the same tier and learn which adjacent roles accelerate your trajectory.',
  },
  {
    num: '05',
    name: 'Strongest Narrative',
    description:
      'Your career story, extracted and structured. The one-paragraph pitch that actually reflects your positioning — not a generic summary.',
  },
  {
    num: '06',
    name: 'Weekly Progress Tracking',
    description:
      'Retake the analysis as you update your CV. Watch your score move. Know exactly what actions are driving improvement.',
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
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 72 }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            What you get
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 400,
            color: 'var(--foreground)',
            lineHeight: 1.1,
            maxWidth: 520,
            letterSpacing: '-0.01em',
          }}>
            Clarity, not<br />
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>encouragement.</em>
          </h2>
        </motion.div>

        {/* Feature rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '64px 1fr 1fr',
                gap: '24px 40px',
                alignItems: 'start',
                padding: '32px 0',
                borderTop: '1px solid var(--accent-dim)',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--subtle)',
                letterSpacing: '0.1em',
                paddingTop: 4,
              }}>
                {feature.num}
              </span>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                fontWeight: 400,
                color: 'var(--foreground)',
                lineHeight: 1.3,
              }}>
                {feature.name}
              </h3>
              <p style={{
                fontSize: 14,
                lineHeight: 1.75,
                color: 'var(--muted)',
              }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
          <div style={{ borderTop: '1px solid var(--accent-dim)' }} />
        </div>
      </div>
    </section>
  )
}
