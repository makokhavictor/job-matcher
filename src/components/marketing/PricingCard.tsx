import React from 'react'
import { Package, FEATURE_FIELDS, Subscription } from '@/types/package'
import { parseISO, format, isAfter } from 'date-fns'

interface PricingCardProps {
  plan: Package
  children?: React.ReactNode
  active?: boolean
  subscription?: Subscription
  variant?: 'minimal' | 'default' | 'featured'
}

export function PricingCard({ plan, children, active, subscription, variant = 'default' }: PricingCardProps) {
  const isCanceledButActive = subscription &&
    subscription.canceled_at &&
    isAfter(parseISO(subscription.end_date), new Date())

  const isFeatured = variant === 'featured'
  const isMinimal = variant === 'minimal'

  const textMain = isFeatured ? 'var(--background)' : 'var(--foreground)'
  const textMuted = isFeatured ? 'color-mix(in srgb, var(--background) 65%, transparent)' : 'var(--muted)'
  const textSubtle = isFeatured ? 'color-mix(in srgb, var(--background) 40%, transparent)' : 'var(--muted)'
  const divider = isFeatured
    ? '1px solid color-mix(in srgb, var(--background) 15%, transparent)'
    : '1px solid var(--accent-dim)'

  const cardStyle: React.CSSProperties = {
    background: isFeatured ? 'var(--foreground)' : 'transparent',
    border: isFeatured ? 'none' : '1px solid var(--accent-dim)',
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '100%',
  }

  return (
    <div style={cardStyle}>
      {/* Active plan badge */}
      {active && (
        <span style={{
          position: 'absolute',
          top: 16,
          right: 16,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: isCanceledButActive ? '#ff8c42' : 'var(--accent)',
          border: `1px solid ${isCanceledButActive ? '#ff8c42' : 'var(--accent)'}`,
          padding: '3px 8px',
        }}>
          {isCanceledButActive
            ? `Ends ${format(parseISO(subscription!.end_date), 'MMM dd')}`
            : 'Current Plan'}
        </span>
      )}

      {/* Tier name */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.18em',
        color: isFeatured ? 'var(--accent)' : 'var(--muted)',
        textTransform: 'uppercase',
        marginBottom: 20,
      }}>
        {plan.name}
      </p>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
        {plan.price > 0 && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 16,
            color: textMain,
            opacity: 0.45,
            alignSelf: 'flex-start',
            marginTop: 10,
          }}>
            $
          </span>
        )}
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 52,
          fontWeight: 400,
          color: textMain,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          {plan.price === 0 ? '0' : plan.price}
        </p>
        {plan.price > 0 && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: textMain,
            opacity: 0.4,
          }}>
            /{plan.billing_cycle.toLowerCase()}
          </span>
        )}
      </div>

      {/* Description */}
      {plan.description && (
        <p
          style={{ fontSize: 14, color: textMuted, lineHeight: 1.6, marginBottom: 32 }}
          dangerouslySetInnerHTML={{ __html: plan.description }}
        />
      )}

      {/* Feature list */}
      <div style={{ flex: 1, borderTop: divider, paddingTop: 24, marginBottom: 32 }}>
        {FEATURE_FIELDS.filter(f => f.key !== 'is_trial').map((feature) => {
          const value = plan.features[feature.key]
          const hasFeature = feature.type === 'boolean'
            ? !!value
            : (typeof value === 'number' && value > 0)

          if (!hasFeature) return null

          const label = feature.type === 'number' ? `${value} ${feature.label}` : feature.label

          return (
            <div key={feature.key} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: isMinimal ? textSubtle : 'var(--accent)',
                flexShrink: 0,
                marginTop: 1,
              }}>
                {isMinimal ? '—' : '✓'}
              </span>
              <p style={{ fontSize: 13, color: textMuted, lineHeight: 1.5 }}>{label}</p>
            </div>
          )
        })}
      </div>

      {children && (
        <div>{children}</div>
      )}
    </div>
  )
}
