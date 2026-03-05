'use client'

import { Spinner } from '@/components/ui/spinner'
import { PricingCard } from './PricingCard'
import { motion } from 'framer-motion'
import { usePlans } from '@/hooks/usePlans'

export function Pricing() {
  const { plans, isLoading, error, hasPlans } = usePlans()

  const sectionStyle = {
    padding: '96px 48px',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--accent-dim)',
  }

  if (isLoading)
    return (
      <section id="pricing" style={{ ...sectionStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <Spinner size={32} />
      </section>
    )
  if (error)
    return (
      <section id="pricing" style={{ ...sectionStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--destructive)' }}>Failed to load plans</p>
      </section>
    )
  if (!hasPlans)
    return (
      <section id="pricing" style={{ ...sectionStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--muted)' }}>No plans available</p>
      </section>
    )

  return (
    <section id="pricing" style={sectionStyle}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        {/* Header */}
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
            Simple, transparent pricing.
          </h2>
        </motion.div>

        {/* Cards */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id || index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              style={{ flex: '1 1 280px', minWidth: 280, maxWidth: 380 }}
            >
              <PricingCard plan={plan}>
                <a
                  href={`/register?plan=${plan.name.toLowerCase()}`}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    padding: '11px 20px',
                    fontSize: 13,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.06em',
                    textDecoration: 'none',
                    background: 'var(--foreground)',
                    color: 'var(--background)',
                    transition: 'opacity 200ms',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {plan.price === 0 ? 'Get Started' : 'Start Now'}
                </a>
              </PricingCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
