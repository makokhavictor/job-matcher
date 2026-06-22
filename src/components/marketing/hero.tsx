'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100dvh',
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
            CV matching & tailoring
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
            Your CV, rewritten
            <br />
            for this exact job.
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
            In under a minute.
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
            Paste the job description. Upload your CV. Fitted matches your
            experience to the role — then rewrites your CV to give you the
            best shot at it.
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
              Tailor my CV
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
            {/* === LEFT: Two input docs (JD + CV stacked) === */}
            {/* JD doc (back) */}
            <rect x="4" y="32" width="42" height="56" rx="1" stroke="var(--subtle)" strokeWidth="1" />
            <text x="25" y="46" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="var(--muted)" letterSpacing="1.5px">JD</text>
            <line x1="12" y1="53" x2="38" y2="53" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />
            <line x1="12" y1="60" x2="38" y2="60" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />
            <line x1="12" y1="67" x2="34" y2="67" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />
            <line x1="12" y1="74" x2="38" y2="74" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />

            {/* CV doc (front, offset — fill occludes back doc) */}
            <rect x="14" y="42" width="42" height="56" rx="1" stroke="var(--muted)" strokeWidth="1" fill="var(--background)" />
            <text x="35" y="56" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="var(--muted)" letterSpacing="1.5px">CV</text>
            <line x1="22" y1="63" x2="48" y2="63" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />
            <line x1="22" y1="70" x2="48" y2="70" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />
            <line x1="22" y1="77" x2="44" y2="77" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />
            <line x1="22" y1="84" x2="48" y2="84" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />
            <text x="28" y="116" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--muted)" letterSpacing="2px">JD + CV</text>

            {/* Arrow 1: inputs → analysis */}
            <line x1="58" y1="70" x2="96" y2="70" stroke="var(--subtle)" strokeWidth="1" />
            <polyline points="92,66 96,70 92,74" stroke="var(--subtle)" strokeWidth="1" fill="none" />

            {/* === ANALYSIS box === */}
            <rect x="98" y="42" width="96" height="56" rx="1" stroke="var(--muted)" strokeWidth="1" />
            <line x1="108" y1="54" x2="184" y2="54" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            <line x1="108" y1="62" x2="184" y2="62" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            <line x1="108" y1="70" x2="184" y2="70" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            <line x1="108" y1="78" x2="184" y2="78" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            <line x1="108" y1="86" x2="184" y2="86" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            {/* scanning highlight */}
            <line x1="108" y1="62" x2="148" y2="62" stroke="var(--muted)" strokeWidth="1" />
            {/* processing dots */}
            <circle cx="136" cy="70" r="2" fill="var(--subtle)" />
            <circle cx="146" cy="70" r="2" fill="var(--muted)" />
            <circle cx="156" cy="70" r="2" fill="var(--subtle)" />
            <text x="146" y="116" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--muted)" letterSpacing="2px">ANALYSIS</text>

            {/* === FORK: analysis → two outputs === */}
            {/* Main stem */}
            <line x1="196" y1="70" x2="214" y2="70" stroke="var(--accent)" strokeWidth="1" />
            {/* Vertical splitter */}
            <line x1="214" y1="44" x2="214" y2="108" stroke="var(--accent)" strokeWidth="1" />
            {/* Upper branch → tailored CV */}
            <line x1="214" y1="44" x2="228" y2="44" stroke="var(--accent)" strokeWidth="1" />
            <polyline points="224,40 228,44 224,48" stroke="var(--accent)" strokeWidth="1" fill="none" />
            {/* Lower branch → score */}
            <line x1="214" y1="108" x2="228" y2="108" stroke="var(--accent)" strokeWidth="1" />
            <polyline points="224,104 228,108 224,112" stroke="var(--accent)" strokeWidth="1" fill="none" />

            {/* === OUTPUT 1: Tailored CV doc (upper right) === */}
            <rect x="230" y="22" width="42" height="50" rx="1" stroke="var(--accent)" strokeWidth="1" />
            <text x="251" y="36" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill="var(--accent)" letterSpacing="1px">FITTED</text>
            <text x="251" y="45" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill="var(--accent)" letterSpacing="1.5px">CV</text>
            <line x1="238" y1="51" x2="264" y2="51" stroke="var(--accent)" strokeWidth="0.75" opacity="0.5" />
            <line x1="238" y1="57" x2="264" y2="57" stroke="var(--accent)" strokeWidth="0.75" opacity="0.5" />
            <line x1="238" y1="63" x2="258" y2="63" stroke="var(--accent)" strokeWidth="0.75" opacity="0.5" />

            {/* === OUTPUT 2: Score circle (lower right) === */}
            <circle cx="258" cy="114" r="28" stroke="var(--accent)" strokeWidth="1" />
            <text x="258" y="122" textAnchor="middle" fontFamily="var(--font-display)" fontSize="26" fill="var(--foreground)" letterSpacing="-1px">82</text>
            {/* tick marks */}
            <line x1="258" y1="83" x2="258" y2="88" stroke="var(--accent-dim)" strokeWidth="0.75" />
            <line x1="258" y1="140" x2="258" y2="145" stroke="var(--accent-dim)" strokeWidth="0.75" />
            <line x1="287" y1="114" x2="292" y2="114" stroke="var(--accent-dim)" strokeWidth="0.75" />
            <line x1="224" y1="114" x2="229" y2="114" stroke="var(--accent-dim)" strokeWidth="0.75" />
            <text x="258" y="155" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--muted)" letterSpacing="2px">SCORE</text>
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
          { label: '~60 sec', desc: 'analysis & rewrite' },
          { label: '0–100', desc: 'match score' },
          { label: 'free', desc: 'to start' },
        ].map(({ label, desc }) => (
          <div key={desc} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--foreground)', letterSpacing: '0.04em' }}>
              {label}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
