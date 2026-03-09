'use client'
import Link from 'next/link'
import { track, Events } from '@/lib/analytics'
import { usePlans } from '@/hooks/usePlans'

export function ProPaywall() {
  const { plans } = usePlans()
  const proPlan = plans.find(p => p.features.advanced_match_scoring && p.price > 0)
  const priceLabel = proPlan
    ? `$${proPlan.price}/${proPlan.billing_cycle.toLowerCase()}`
    : '$29/mo'
  return (
    <div style={{ borderTop: '1px solid var(--accent-dim)', paddingTop: 32, marginTop: 8 }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--subtle)', marginBottom: 20 }}>
        CRITICAL GAPS
      </p>

      {/* Blurred placeholder content */}
      <div style={{ position: 'relative', marginBottom: 32 }}>
        <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid var(--surface)' }}>
              <p style={{ fontSize: 14, color: 'var(--foreground)', marginBottom: 4 }}>████████████████████</p>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>████████████████████████████████</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--accent-dim)', padding: 28, borderRadius: 'var(--radius-lg)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--subtle)', marginBottom: 12 }}>
          UNLOCK YOUR FULL REPORT
        </p>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
          See your exact skill gaps, fastest paths, and how to position your story.
        </p>
        <Link
          href="/dashboard/packages/upgrade"
          onClick={() => track(Events.PAYWALL_HIT)}
          style={{
            display: 'inline-block',
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
            padding: '12px 24px',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: 'var(--radius)',
          }}
        >
          Upgrade to Pro — {priceLabel}
        </Link>
        <p style={{ fontSize: 12, color: 'var(--subtle)', marginTop: 12 }}>No commitment. Cancel anytime.</p>
      </div>
    </div>
  )
}
