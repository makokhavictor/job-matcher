'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function CTA() {
  return (
    <section style={{
      background: 'var(--foreground)',
      color: 'var(--background)',
      padding: '96px 48px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background score decoration */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: '-1%',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(160px, 22vw, 340px)',
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.04)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-0.04em',
        }}
      >
        100
      </div>

      <div style={{ maxWidth: 640, position: 'relative', zIndex: 1 }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Ready when you are
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 60px)',
            fontWeight: 400,
            lineHeight: 1.1,
            color: 'var(--background)',
            marginBottom: 24,
            letterSpacing: '-0.01em',
          }}
        >
          The job is open now.
          <br />
          Your CV should say
          <br />
          <em style={{ fontStyle: 'italic', opacity: 0.55 }}>the right things.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: 'var(--background)',
            opacity: 0.55,
            maxWidth: 400,
            marginBottom: 40,
          }}
        >
          Takes 60 seconds. Costs nothing to start.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
        >
          <Link
            href="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--background)',
              color: 'var(--foreground)',
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
            Tailor my CV →
          </Link>
          <Link
            href="/#pricing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '14px 22px',
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              color: 'var(--background)',
              border: '1px solid rgba(255,255,255,0.2)',
              opacity: 0.65,
              transition: 'opacity 200ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.65')}
          >
            View pricing
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
