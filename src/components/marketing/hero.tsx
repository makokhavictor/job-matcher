'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

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
      {/* Oversized background score — the unforgettable hook */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
        style={{
          position: 'absolute',
          right: '-2%',
          top: '50%',
          transform: 'translateY(-55%)',
          fontSize: 'clamp(220px, 30vw, 480px)',
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          color: 'var(--accent-dim)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-0.04em',
        }}
      >
        87
      </motion.div>

      {/* Thin horizontal rule — editorial detail */}
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

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 600, position: 'relative', zIndex: 1 }}>
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
          Career Position Intelligence
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 5.5vw, 76px)',
            fontWeight: 400,
            lineHeight: 1.08,
            color: 'var(--foreground)',
            marginBottom: 28,
            letterSpacing: '-0.01em',
          }}
        >
          Know where you stand.
          <br />
          <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Before you apply.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: 'var(--muted)',
            maxWidth: 460,
            marginBottom: 48,
          }}
        >
          Upload your CV. Pick a target role. We calculate your{' '}
          <strong style={{ color: 'var(--foreground)', fontWeight: 500 }}>Pivot Readiness Score</strong>{' '}
          — a precise measure of how ready you are to make that career move.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
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
              padding: '13px 28px',
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              transition: 'opacity 200ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Get Started
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <a
            href="#features"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--muted)',
              padding: '13px 22px',
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
            See how it works
          </a>
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
          { label: 'instant', desc: 'results' },
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
    </section>
  )
}
