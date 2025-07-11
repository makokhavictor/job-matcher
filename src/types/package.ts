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
}

export interface Subscription {
  id: number
  package_id: number
  plan_id?: number // Added to support LemonSqueezy plan/variant id
  status: string
  start_date: string
  end_date: string
  canceled_at: string | null
  renewal_date: string | null
  payment_method: string | null
  package: Package
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

