import { RegisterForm } from '@/components/auth/register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account | Pivot',
  description: 'Create an account to discover your Pivot Readiness Score and understand your career position.',
  robots: { index: false, follow: false },
}

export default function RegisterPage() {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
      {/* Brand panel */}
      <div style={{
        display: 'none',
        flex: '0 0 45%',
        background: 'var(--foreground)',
        color: 'var(--background)',
        padding: '64px 56px',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="auth-brand-panel"
      >
        {/* Background score */}
        <div aria-hidden style={{
          position: 'absolute',
          right: -20,
          bottom: 20,
          fontSize: 'clamp(160px, 18vw, 280px)',
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.05)',
          lineHeight: 1,
          userSelect: 'none',
          letterSpacing: '-0.04em',
        }}>87</div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>Pivot</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--background)', opacity: 0.5 }}>
            Career Position Intelligence
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2.5vw, 34px)',
            fontWeight: 400,
            color: 'var(--background)',
            lineHeight: 1.3,
            marginBottom: 16,
            fontStyle: 'italic',
          }}>
            Your career position,<br />quantified.
          </h2>
          <p style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.5)',
            maxWidth: 340,
            marginBottom: 32,
          }}>
            Upload your CV, set a target role, and receive a Pivot Readiness Score
            that tells you exactly where you stand — and what to do about it.
          </p>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: 24,
            display: 'flex',
            gap: 40,
          }}>
            {[{ n: 'Free', d: 'to start' }, { n: '~40s', d: 'analysis' }, { n: 'Instant', d: 'results' }].map(({ n, d }) => (
              <div key={d}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--background)', marginBottom: 4 }}>{n}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{d}</div>
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
        background: 'var(--background)',
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
