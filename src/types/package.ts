export interface PackageFeatures {
  unlimited_cv_analysis: boolean
  max_cvs: number
  advanced_match_scoring: boolean
  tailored_improvement_suggestions: boolean
  result_history_days: number
  priority_support: boolean
  multiple_cv_versions: boolean
  report_export: boolean
  is_trial: boolean
}

export interface Package {
  id?: number | undefined
  name: string
  description: string
  price: number
  currency: string
  billing_cycle: string
  is_active: boolean
  features: PackageFeatures
  variantId?: number | undefined
  product_id?: number | undefined
  display_order?: number | undefined
}

// New plan structure matching the API response
export interface Plan {
  id: number
  code: string
  name: string
  description: string
  features: PackageFeatures
  plan_type: string
}

export interface PlanPrice {
  id: number
  amount: number
  currency: string
  interval: string
  interval_count: number
  trial_interval: string | null
  trial_interval_count: number | null
}

export interface Subscription {
  id: number
  plan_id: number
  plan_price_id: number
  subscription_id: number | null
  external_subscription_id: string | null
  provider: string
  status: string
  start_date: string
  end_date: string
  canceled_at: string | null
  renewal_date: string | null
  payment_method: string | null
  plan: Plan
  plan_price: PlanPrice
  // Legacy fields for backward compatibility
  package_id: number | null
  package: Package | null
}

export const FEATURE_FIELDS: Array<{
  key: keyof PackageFeatures
  label: string
  type: 'boolean' | 'number'
}> = [
  { key: 'unlimited_cv_analysis', label: 'Unlimited CV Analysis', type: 'boolean' },
  { key: 'max_cvs', label: 'Max CV Analysis', type: 'number' },
  { key: 'advanced_match_scoring', label: 'Advanced Match Scoring', type: 'boolean' },
  { key: 'tailored_improvement_suggestions', label: 'Tailored Improvement Suggestions', type: 'boolean' },
  { key: 'result_history_days', label: 'Days Result History', type: 'number' },
  { key: 'priority_support', label: 'Priority Support', type: 'boolean' },
  { key: 'multiple_cv_versions', label: 'Multiple CV Versions', type: 'boolean' },
  { key: 'report_export', label: 'Report Export', type: 'boolean' },
  { key: 'is_trial', label: 'Trial', type: 'boolean' },
]

// Shared free plan for use in both Pricing and PlansGrid components
export const freePlan: Package = {
  id: 0,
  name: 'Free',
  description: 'Get started with basic features for your job search. Perfect for those exploring or just starting out.',
  price: 0,
  currency: 'USD',
  billing_cycle: 'Forever',
  is_active: true,
  features: {
    unlimited_cv_analysis: false,
    max_cvs: 2,
    advanced_match_scoring: false,
    tailored_improvement_suggestions: false,
    result_history_days: 7,
    priority_support: false,
    multiple_cv_versions: false,
    report_export: false,
    is_trial: false,
  },
};

