'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: 'Paste the job description',
    body: 'Drop in the full JD from any job board. Fitted extracts exactly what the role requires — skills, experience, language, priorities.',
  },
  {
    num: '02',
    title: 'Upload your CV',
    body: "We read what you've actually done, not just your titles. Your experience is mapped against the role's real requirements.",
  },
  {
    num: '03',
    title: 'Get your tailored CV',
    body: 'A complete rewrite, ready to download. Plus a 0–100 match score so you know exactly where you stood — and how much ground you gained.',
  },
]

export function HowItWorks() {
  return (
    <section style={{
      padding: '96px 48px',
      borderBottom: '1px solid var(--accent-dim)',
    }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
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
            How it works
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 3.5vw, 48px)',
            fontWeight: 400,
            color: 'var(--foreground)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}>
            Three steps.<br />
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Sixty seconds.</em>
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: '1px solid var(--accent-dim)',
        }}
          className="how-it-works-grid"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              style={{
                padding: '40px 40px 40px 0',
                borderRight: index < steps.length - 1 ? '1px solid var(--accent-dim)' : 'none',
                paddingLeft: index > 0 ? 40 : 0,
              }}
            >
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--accent)',
                letterSpacing: '0.1em',
                marginBottom: 24,
              }}>
                {step.num}
              </p>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 400,
                color: 'var(--foreground)',
                lineHeight: 1.2,
                marginBottom: 16,
              }}>
                {step.title}
              </h3>
              <p style={{
                fontSize: 14,
                lineHeight: 1.75,
                color: 'var(--muted)',
              }}>
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
          }
          .how-it-works-grid > div {
            border-right: none !important;
            border-bottom: 1px solid var(--accent-dim);
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        }
      `}</style>
    </section>
  )
}
