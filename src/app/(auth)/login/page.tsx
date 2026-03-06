import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login | Pivot',
  description: 'Sign in to your account to access your career position dashboard.',
  robots: { index: false, follow: false },
}

const stats = [
  { n: '87', d: 'avg score' },
  { n: '40s', d: 'analysis' },
  { n: '0–100', d: 'scale' },
]

export default function LoginPage() {
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

        {/* Bottom — quote + stats */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <blockquote style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2.5vw, 34px)',
            fontWeight: 400,
            color: 'var(--primary-foreground)',
            lineHeight: 1.3,
            marginBottom: 32,
            fontStyle: 'italic',
          }}>
            &ldquo;The gap between where you are and where you want to be — measured, not guessed.&rdquo;
          </blockquote>
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
            }}>Welcome back</p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 400,
              color: 'var(--foreground)',
              lineHeight: 1.2,
            }}>
              Sign in to your account
            </h1>
          </div>
          <LoginForm />
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
