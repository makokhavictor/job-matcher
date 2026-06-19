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
            Career Readiness Score
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
            if you&apos;re ready to pivot.
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

        {/* Right: pipeline illustration */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="hero-score-card"
          style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
        >
          <svg
            viewBox="0 0 352 165"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto' }}
          >
            {/* Stage 1: CV document */}
            <rect x="10" y="46" width="56" height="74" rx="1" stroke="var(--accent-dim)" strokeWidth="1" />
            <text x="38" y="60" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--subtle)" letterSpacing="2">CV</text>
            <line x1="20" y1="68" x2="56" y2="68" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.5" />
            <line x1="20" y1="76" x2="56" y2="76" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.5" />
            <line x1="20" y1="84" x2="46" y2="84" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.5" />
            <line x1="20" y1="92" x2="54" y2="92" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.5" />
            <line x1="20" y1="100" x2="40" y2="100" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.5" />
            <text x="38" y="135" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--subtle)" letterSpacing="2">YOUR CV</text>

            {/* Arrow 1: CV → analysis */}
            <line x1="68" y1="83" x2="110" y2="83" stroke="var(--accent-dim)" strokeWidth="1" />
            <polyline points="106,79 110,83 106,87" stroke="var(--accent-dim)" strokeWidth="1" fill="none" />

            {/* Target role feeds in from above */}
            <rect x="124" y="18" width="80" height="22" rx="1" stroke="var(--accent-dim)" strokeWidth="0.75" strokeDasharray="2 2" />
            <text x="164" y="33" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--muted)" letterSpacing="0.5">Head of Product</text>
            <line x1="164" y1="40" x2="164" y2="54" stroke="var(--accent-dim)" strokeWidth="0.75" strokeDasharray="2 2" />
            <polyline points="160,50 164,54 168,50" stroke="var(--accent-dim)" strokeWidth="0.75" fill="none" />

            {/* Stage 2: Analysis box */}
            <rect x="112" y="56" width="104" height="56" rx="1" stroke="var(--muted)" strokeWidth="1" />
            <line x1="122" y1="68" x2="206" y2="68" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            <line x1="122" y1="76" x2="206" y2="76" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            <line x1="122" y1="84" x2="206" y2="84" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            <line x1="122" y1="92" x2="206" y2="92" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            <line x1="122" y1="100" x2="206" y2="100" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            {/* scanning highlight */}
            <line x1="122" y1="76" x2="172" y2="76" stroke="var(--muted)" strokeWidth="1" />
            {/* processing dots */}
            <circle cx="146" cy="84" r="2" fill="var(--accent-dim)" />
            <circle cx="164" cy="84" r="2" fill="var(--muted)" />
            <circle cx="182" cy="84" r="2" fill="var(--accent-dim)" />
            <text x="164" y="128" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--subtle)" letterSpacing="2">ANALYSIS</text>

            {/* Arrow 2: analysis → score (brighter) */}
            <line x1="218" y1="83" x2="244" y2="83" stroke="var(--accent)" strokeWidth="1" />
            <polyline points="240,79 244,83 240,87" stroke="var(--accent)" strokeWidth="1" fill="none" />

            {/* Stage 3: Score circle */}
            <circle cx="290" cy="83" r="48" stroke="var(--accent)" strokeWidth="1" />
            <text x="290" y="96" textAnchor="middle" fontFamily="var(--font-display)" fontSize="36" fill="var(--foreground)" letterSpacing="-2">78</text>
            {/* tick marks at 12 / 3 / 6 / 9 */}
            <line x1="290" y1="32" x2="290" y2="38" stroke="var(--accent-dim)" strokeWidth="0.75" />
            <line x1="290" y1="128" x2="290" y2="134" stroke="var(--accent-dim)" strokeWidth="0.75" />
            <line x1="339" y1="83" x2="345" y2="83" stroke="var(--accent-dim)" strokeWidth="0.75" />
            <line x1="235" y1="83" x2="241" y2="83" stroke="var(--accent-dim)" strokeWidth="0.75" />
            <text x="290" y="150" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--subtle)" letterSpacing="2">SCORE</text>
          </svg>
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
