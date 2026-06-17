'use client'

import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'
import { PricingCard } from './PricingCard'
import { motion } from 'framer-motion'
import { usePlans } from '@/hooks/usePlans'

const FALLBACK_PLANS = [
  {
    tier: 'Free',
    price: '$0',
    tagline: 'See where you stand.',
    features: [
      'Pivot Readiness Score (0–100)',
      'Vocabulary & skills breakdown',
      'Top 2 transferable skills',
      'Unlimited re-analyses',
    ],
    cta: 'Get started free',
    href: '/register',
    highlight: false,
  },
  {
    tier: 'Pro',
    price: '$29',
    period: '/mo',
    tagline: 'Know exactly what to do next.',
    features: [
      'Everything in Free',
      'Full critical gaps report',
      'Fastest path to target role',
      'Strongest career narrative',
      'Entry point discovery',
      'Weekly progress tracking',
    ],
    cta: 'Start Pro',
    href: '/register?plan=pro',
    highlight: true,
  },
]

const sectionStyle = {
  padding: '96px 48px',
  borderBottom: '1px solid var(--accent-dim)',
}

import type { Package } from '@/types/package'

function PricingHeader({ plans }: { plans?: Package[] }) {
  const count = plans?.length ?? 2
  const countWord = count === 3 ? 'Three' : count === 2 ? 'Two' : 'Every'

  return (
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
        Pricing
      </p>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(28px, 3.5vw, 48px)',
        fontWeight: 400,
        color: 'var(--foreground)',
        lineHeight: 1.1,
        letterSpacing: '-0.01em',
      }}>
        One score.<br />
        <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{countWord} plans.</em>
      </h2>
    </motion.div>
  )
}

function FallbackPricing() {
  const [free, pro] = FALLBACK_PLANS

  return (
    <section id="pricing" style={sectionStyle}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <PricingHeader />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="pricing-grid">

          {/* Free tier — minimal, outlined */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{
              border: '1px solid var(--accent-dim)',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ marginBottom: 32 }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.18em',
                color: 'var(--subtle)',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}>
                {free.tier}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 52,
                  fontWeight: 400,
                  color: 'var(--foreground)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}>
                  {free.price}
                </p>
              </div>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
                {free.tagline}
              </p>
            </div>

            <div style={{ flex: 1, borderTop: '1px solid var(--accent-dim)', paddingTop: 24, marginBottom: 32 }}>
              {free.features.map((feature) => (
                <div key={feature} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--subtle)', flexShrink: 0, marginTop: 1 }}>—</span>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{feature}</p>
                </div>
              ))}
            </div>

            <Link
              href={free.href}
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '13px 24px',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: 'var(--foreground)',
                border: '1px solid var(--accent-dim)',
                transition: 'border-color 200ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--foreground)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--accent-dim)')}
            >
              {free.cta}
            </Link>
          </motion.div>

          {/* Pro tier — inverted, premium */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              background: 'var(--foreground)',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <div style={{ marginBottom: 32 }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.18em',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}>
                {pro.tier}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 52,
                  fontWeight: 400,
                  color: 'var(--background)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}>
                  {pro.price}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--background)', opacity: 0.4 }}>
                  {pro.period}
                </p>
              </div>
              <p style={{ fontSize: 14, color: 'var(--background)', opacity: 0.6, lineHeight: 1.6 }}>
                {pro.tagline}
              </p>
            </div>

            <div style={{ flex: 1, borderTop: '1px solid color-mix(in srgb, var(--background) 20%, transparent)', paddingTop: 24, marginBottom: 32 }}>
              {pro.features.map((feature) => (
                <div key={feature} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>✓</span>
                  <p style={{ fontSize: 13, color: 'var(--background)', opacity: 0.75, lineHeight: 1.5 }}>{feature}</p>
                </div>
              ))}
            </div>

            <Link
              href={pro.href}
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '13px 24px',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                background: 'var(--accent)',
                color: 'var(--accent-foreground)',
                transition: 'opacity 200ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {pro.cta}
            </Link>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

export function Pricing() {
  const { plans, isLoading, error, hasPlans } = usePlans()

  if (isLoading)
    return (
      <section id="pricing" style={{ ...sectionStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <Spinner size={32} />
      </section>
    )

  if (error || !hasPlans) return <FallbackPricing />

  return (
    <section id="pricing" style={sectionStyle}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <PricingHeader plans={plans} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {plans.map((plan, index) => {
            const variant = plan.features.is_trial || plan.price === 0
              ? 'minimal'
              : index === plans.length - 1
                ? 'featured'
                : 'default'
            const isFeatured = variant === 'featured'
            return (
              <motion.div
                key={plan.id || index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <PricingCard plan={plan} variant={variant}>
                  <a
                    href={`/register?plan=${plan.name.toLowerCase()}`}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'center',
                      padding: '13px 24px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      background: isFeatured ? 'var(--accent)' : 'var(--foreground)',
                      color: isFeatured ? '#fff' : 'var(--background)',
                      transition: 'opacity 200ms',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.82')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    {plan.price === 0 ? 'Get started free' : 'Start now'}
                  </a>
                </PricingCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
