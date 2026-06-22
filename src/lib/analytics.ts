/**
 * Thin wrapper around analytics events.
 * Currently uses console.log (dev) — swap the body of `track` for your
 * analytics provider (Posthog, Mixpanel, Plausible, etc.) when ready.
 */
export function track(event: string, properties?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[analytics] ${event}`, properties ?? {})
    return
  }
  // TODO: wire to real provider
  // posthog.capture(event, properties)
}

// Key conversion events — call these at the right moments
export const Events = {
  REPORT_VIEWED: 'report_viewed',
  PAYWALL_HIT: 'paywall_hit',
  UPGRADE_CLICKED: 'upgrade_clicked',
  ONBOARDING_STARTED: 'onboarding_started',
  ANALYSIS_SUBMITTED: 'analysis_submitted',
  ANALYSIS_COMPLETED: 'analysis_completed',
} as const
