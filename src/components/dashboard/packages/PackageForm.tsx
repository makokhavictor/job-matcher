"use client"

import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/lib/utils/apiClient'
import { Package, FEATURE_FIELDS } from '@/types/package'
import { useEffect } from 'react'

const defaultValues: Package = {
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
    is_trial: false,
    generate_tailored_cv: false
  },
}
export function PackageForm({ initialData, onSuccess }: { initialData?: Package, onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<Package>({
    defaultValues: initialData || defaultValues,
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    } else {
      reset(defaultValues)
    }
  }, [initialData, reset])

  const mutation = useMutation({
    mutationFn: async (data: Package) => {
      const payload = { ...data, features: data.features }
      if (data.id) {
        // Update
        const res = await apiClient(`/packages/${data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        return res
      } else {
        // Create
        const res = await apiClient('/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        return res
      }
    },
    onSuccess: () => {
      toast.success('Package saved successfully!')
      reset(defaultValues)
      queryClient.invalidateQueries({ queryKey: ['packages'] })
      if (onSuccess) onSuccess()
    },
    onError: (err: unknown) => {
      console.log(err);
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Failed to save package')
      }
    },
  })

  const onSubmit = (data: Package) => {
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
