import { RegisterForm } from '@/components/auth/register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account | Pivot',
  description: 'Create an account to discover your Pivot Readiness Score and understand your career position.',
  robots: { index: false, follow: false },
}

const stats = [
  { n: 'Free', d: 'to start' },
  { n: '~40s', d: 'analysis' },
  { n: 'Instant', d: 'results' },
]

export default function RegisterPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Brand panel */}
      <div
        className="auth-brand-panel"
        style={{
          display: 'none',
          flex: '0 0 45%',
          backgroundColor: 'var(--primary)',
          padding: '64px 56px',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative score watermark */}
        <div aria-hidden style={{
          position: 'absolute',
          right: -20,
          bottom: 20,
          fontSize: 'clamp(160px, 18vw, 280px)',
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          color: 'var(--primary-foreground)',
          opacity: 0.04,
          lineHeight: 1,
          userSelect: 'none',
          letterSpacing: '-0.04em',
          pointerEvents: 'none',
        }}>87</div>

        {/* Top — brand */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>Pivot</p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            color: 'var(--primary-foreground)',
            opacity: 0.5,
          }}>Career Position Intelligence</p>
        </div>

        {/* Bottom — headline + stats */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2.5vw, 34px)',
            fontWeight: 400,
            color: 'var(--primary-foreground)',
            lineHeight: 1.3,
            marginBottom: 16,
            fontStyle: 'italic',
          }}>
            Your career position,<br />quantified.
          </h2>
          <p style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: 'var(--primary-foreground)',
            opacity: 0.55,
            maxWidth: 340,
            marginBottom: 32,
          }}>
            Upload your CV, set a target role, and receive a Pivot Readiness Score
            that tells you exactly where you stand — and what to do about it.
          </p>
          <div style={{
            borderTop: '1px solid color-mix(in srgb, var(--primary-foreground) 15%, transparent)',
            paddingTop: 24,
            display: 'flex',
            gap: 40,
          }}>
            {stats.map(({ n, d }) => (
              <div key={d}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 18,
                  color: 'var(--primary-foreground)',
                  marginBottom: 4,
                }}>{n}</div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--primary-foreground)',
                  opacity: 0.4,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ marginBottom: 40 }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.18em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}>Get started — free</p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 400,
              color: 'var(--foreground)',
              lineHeight: 1.2,
            }}>
              Create your account
            </h1>
          </div>
          <RegisterForm />
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .auth-brand-panel { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
