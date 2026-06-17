'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const scoreCard = {
  label: 'Example report',
  transition: 'Sales Engineer → Head of Product',
  score: 78,
  bars: [
    { label: 'VOCABULARY', value: 76 },
    { label: 'SKILLS', value: 62 },
    { label: 'NARRATIVE', value: 88 },
  ],
}

export function Hero() {
  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '80px 48px 56px',
      borderBottom: '1px solid var(--accent-dim)',
    }}>
      {/* Thin horizontal rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: 1,
          background: 'var(--accent-dim)',
          marginBottom: 48,
          transformOrigin: 'left',
        }}
      />

      {/* Two-column layout */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 420px',
        gap: '48px 80px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}
        className="hero-grid"
      >
        {/* Left: copy */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.18em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              marginBottom: 28,
            }}
          >
            Pivot Readiness
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(44px, 5.5vw, 80px)',
              fontWeight: 400,
              lineHeight: 1.05,
              color: 'var(--foreground)',
              marginBottom: 0,
              letterSpacing: '-0.02em',
            }}
          >
            You don&apos;t know
            <br />
            where you stand.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.42 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 4.5vw, 64px)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.1,
              color: 'var(--accent)',
              marginBottom: 32,
              letterSpacing: '-0.02em',
            }}
          >
            Until now.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              fontSize: 16,
              lineHeight: 1.75,
              color: 'var(--muted)',
              maxWidth: 440,
              marginBottom: 40,
            }}
          >
            Upload your CV. Name your target role. Get a precise 0–100 score
            measuring exactly how ready you are to make that career move.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.58 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}
          >
            <Link
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'var(--foreground)',
                color: 'var(--background)',
                padding: '14px 32px',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.06em',
                textDecoration: 'none',
                transition: 'opacity 200ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Get my score
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a
              href="#report"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--muted)',
                padding: '14px 22px',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.06em',
                textDecoration: 'none',
                border: '1px solid var(--accent-dim)',
                transition: 'color 200ms, border-color 200ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--foreground)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--accent-dim)' }}
            >
              See a sample report
            </a>
          </motion.div>
        </div>

        {/* Right: score card preview */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="hero-score-card"
          style={{
            border: '1px solid var(--accent-dim)',
            padding: '32px',
            background: 'var(--surface)',
            position: 'relative',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.2em',
            color: 'var(--subtle)',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            {scoreCard.label}
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--muted)',
            marginBottom: 24,
            letterSpacing: '0.04em',
          }}>
            {scoreCard.transition}
          </p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 88,
              fontWeight: 400,
              color: 'var(--foreground)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}>
              {scoreCard.score}
            </p>
          </div>

          <div style={{ width: '100%', height: 1, background: 'var(--accent-dim)', margin: '20px 0' }} />

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.16em',
            color: 'var(--subtle)',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            Pivot Readiness
          </p>

          {scoreCard.bars.map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.1em',
                color: 'var(--subtle)',
                width: 76,
                flexShrink: 0,
              }}>
                {label}
              </p>
              <div style={{ flex: 1, height: 3, background: 'var(--accent-dim)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${value}%`,
                  background: 'var(--accent)',
                  transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
                }} />
              </div>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--foreground)',
                width: 24,
                textAlign: 'right',
              }}>
                {value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom stats strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid var(--accent-dim)',
          paddingTop: 24,
          marginTop: 60,
          display: 'flex',
          gap: 48,
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: '~40 sec', desc: 'analysis time' },
          { label: '0–100', desc: 'readiness score' },
          { label: 'free', desc: 'to start' },
        ].map(({ label, desc }) => (
          <div key={desc} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--foreground)', letterSpacing: '0.04em' }}>
              {label}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--subtle)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {desc}
            </span>
          </div>
        ))}
      </motion.div>

      <style>{`
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-score-card { display: none !important; }
        }
      `}</style>
    </section>
  )
}
