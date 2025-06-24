"use client"

import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/lib/utils/apiClient'

const FEATURE_FIELDS: Array<{
  key: keyof PackageFormValues['features']
  label: string
  type: 'boolean' | 'number'
}> = [
  { key: 'unlimited_cv_analysis', label: 'Unlimited CV Analysis', type: 'boolean' },
  { key: 'max_cvs', label: 'Max CVs', type: 'number' },
  { key: 'advanced_match_scoring', label: 'Advanced Match Scoring', type: 'boolean' },
  { key: 'tailored_improvement_suggestions', label: 'Tailored Improvement Suggestions', type: 'boolean' },
  { key: 'result_history_days', label: 'Result History (days)', type: 'number' },
  { key: 'priority_support', label: 'Priority Support', type: 'boolean' },
  { key: 'multiple_cv_versions', label: 'Multiple CV Versions', type: 'boolean' },
  { key: 'report_export', label: 'Report Export', type: 'boolean' },
]

type PackageFormValues = {
  name: string
  description: string
  price: number
  currency: string
  billing_cycle: string
  is_active: boolean
  features: {
    unlimited_cv_analysis: boolean
    max_cvs: number
    advanced_match_scoring: boolean
    tailored_improvement_suggestions: boolean
    result_history_days: number
    priority_support: boolean
    multiple_cv_versions: boolean
    report_export: boolean
  }
}

const defaultValues: PackageFormValues = {
  name: '',
  description: '',
  price: 0,
  currency: 'USD',
  billing_cycle: 'MONTHLY',
  is_active: true,
  features: {
    unlimited_cv_analysis: false,
    max_cvs: 1,
    advanced_match_scoring: false,
    tailored_improvement_suggestions: false,
    result_history_days: 7,
    priority_support: false,
    multiple_cv_versions: false,
    report_export: true,
  },
}

export function PackageForm() {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<PackageFormValues>({
    defaultValues,
  })

  const mutation = useMutation({
    mutationFn: async (data: PackageFormValues) => {
      const payload = { ...data, features: data.features }
      const res = await apiClient('/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      return res
    },
    onSuccess: () => {
      toast.success('Package created successfully!')
      reset(defaultValues)
    },
    onError: (err: unknown) => {
      console.log(err);
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Failed to create package')
      }
    },
  })

  const onSubmit = (data: PackageFormValues) => {
    mutation.mutate(data)
  }

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 mb-8">
        <h2 className="text-xl font-semibold text-primary-700 mb-2">Create / Update Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-secondary-700 mb-1">Name</label>
            <Input {...register('name', { required: 'Name is required' })} placeholder="Package name" className="w-full" />
            {errors.name && <span className="text-red-600 text-xs">{errors.name.message}</span>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-secondary-700 mb-1">Description</label>
            <textarea 
              {...register('description', { required: 'Description is required' })}
              placeholder="Description"
              className="w-full border rounded px-2 py-1 min-h-[80px]"
            />
            {errors.description && <span className="text-red-600 text-xs">{errors.description.message}</span>}
          </div>
          <div>
            <label className="block text-secondary-700 mb-1">Price</label>
            <Input type="number" step="0.01" {...register('price', { required: 'Price is required', min: 0 })} placeholder="0" />
            {errors.price && <span className="text-red-600 text-xs">{errors.price.message}</span>}
          </div>
          <div>
            <label className="block text-secondary-700 mb-1">Currency</label>
            <Input {...register('currency', { required: 'Currency is required' })} placeholder="USD" />
            {errors.currency && <span className="text-red-600 text-xs">{errors.currency.message}</span>}
          </div>
          <div>
            <label className="block text-secondary-700 mb-1">Billing Cycle</label>
            <select {...register('billing_cycle', { required: true })} className="w-full border rounded px-2 py-1">
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="accent-accent-500"
                  id="is_active"
                />
              )}
            />
            <span className="text-secondary-700">Active</span>
          </div>
        </div>
        <div>
          <label className="block text-secondary-700 mb-1">Features</label>
          <div className="space-y-2">
            {FEATURE_FIELDS.map((feature) => (
              <div key={feature.key} className="flex items-center gap-2">
                {feature.type === 'boolean' ? (
                  <Controller
                    name={`features.${feature.key}` as const}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                        id={feature.key}
                      />
                    )}
                  />
                ) : (
                  <Controller
                    name={`features.${feature.key}` as const}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        value={typeof field.value === 'number' ? field.value : ''}
                        onChange={e => field.onChange(Number(e.target.value))}
                        className="w-32"
                        id={feature.key}
                      />
                    )}
                  />
                )}
                <label htmlFor={feature.key} className="text-secondary-700">
                  {feature.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit" className="mt-4" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save Package'}</Button>
      </form>
  )
}
