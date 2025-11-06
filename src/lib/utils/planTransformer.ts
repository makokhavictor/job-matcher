import type { Package } from '@/types/package'
import { cleanPlanName } from './planUtils'

// Type definition for the new plan API response structure
export interface PlanResponse {
  id: number
  code: string
  name: string
  description: string
  features: {
    unlimited_cv_analysis?: boolean
    max_cvs?: number
    advanced_match_scoring?: boolean
    tailored_improvement_suggestions?: boolean
    result_history_days?: number
    priority_support?: boolean
    multiple_cv_versions?: boolean
    report_export?: boolean
    is_trial?: boolean
  }
  plan_metadata: {
    polar_product_id: string
    polar_synced_at: string
    polar_order: number
    polar_plan_type: string
    polar_display_order: number
    polar_data: {
      id: string
      name: string
      description: string
      recurring_interval: string
      is_recurring: boolean
      is_archived: boolean
      organization_id: string
      metadata: Record<string, unknown>
      prices: unknown[]
      benefits: unknown[]
      medias: unknown[]
      attached_custom_fields: unknown[]
      _sync_order: number
      created_at: string
      modified_at: string
    }
  }
  is_active: boolean
  prices: Array<{
    id: number
    currency: string
    amount: number
    interval: string
    interval_count: number
    trial_interval: string | null
    trial_interval_count: number | null
    external_provider: string
    external_product_id: string
    external_price_id: string
    is_active: boolean
    created_at: string
    updated_at: string
  }>
  created_at: string
  updated_at: string
}

/**
 * Transforms the new plan API response to the existing Package interface
 */
export function transformPlanToPackage(plan: PlanResponse): Package {
  // Get the first active price (assuming there's at least one)
  const activePrice = plan.prices.find(price => price.is_active) || plan.prices[0]
  
  // Default features structure to ensure all required fields exist
  const defaultFeatures = {
    unlimited_cv_analysis: false,
    max_cvs: 1,
    advanced_match_scoring: false,
    tailored_improvement_suggestions: false,
    result_history_days: 0,
    priority_support: false,
    multiple_cv_versions: false,
    report_export: false,
    is_trial: false,
    generate_tailored_cv: false,
  }

  return {
    id: plan.id,
    name: cleanPlanName(plan.name),
    description: plan.description,
    price: activePrice ? activePrice.amount : 0,
    currency: activePrice ? activePrice.currency : 'USD',
    billing_cycle: activePrice ? activePrice.interval.toLowerCase() : 'month',
    is_active: plan.is_active,
    features: {
      ...defaultFeatures,
      ...plan.features,
    },
    product_id: plan.id, // Use plan.id as product_id for consistency
    plan_price_id: activePrice ? activePrice.id : undefined, // Add the price ID for backend API
    display_order: plan.plan_metadata.polar_display_order, // Preserve display order for sorting
  }
}

/**
 * Transforms an array of plans from the new API response
 */
export function transformPlansToPackages(plans: PlanResponse[]): Package[] {
  return plans.map(transformPlanToPackage)
}
