'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/utils/apiClient'
import { Spinner } from '@/components/ui/spinner'
import { Package } from '@/types/package'
import { toast } from 'sonner'
import { useAuth } from '@/app/providers/auth-provider'
import { PricingCard } from '@/components/marketing/PricingCard'
import { CardFooter } from '@/components/ui/card'



async function fetchPublicPackages(): Promise<Package[]> {
  const res = await fetch('/api/payments/products');
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  // Default features for LemonSqueezy variants (customize as needed)
  const defaultFeatures = {
    unlimited_cv_analysis: false,
    max_cvs: 1,
    advanced_match_scoring: false,
    tailored_improvement_suggestions: false,
    result_history_days: 7,
    priority_support: false,
    multiple_cv_versions: false,
    report_export: false,
    is_trial: false,
  };

  const featureMap: Record<string, Partial<typeof defaultFeatures>> = {
    'Trial': {
      is_trial: true,
      result_history_days: 7,
    },
    'Basic': {
      max_cvs: 3,
      tailored_improvement_suggestions: true,
      result_history_days: 30,
    },
    'Pro': {
      unlimited_cv_analysis: true,
      max_cvs: 10,
      advanced_match_scoring: true,
      tailored_improvement_suggestions: true,
      result_history_days: 90,
      priority_support: true,
      multiple_cv_versions: true,
      report_export: true,
    }
  }
  // Map each variant to a displayable package, extracting info from product and variant
  const variants = (data.products as Record<string, unknown>[] || []).flatMap((product) =>
    (product.variants as Record<string, unknown>[] || [])
      .slice(1) // Ignore the first variant
      .map((variant) => {
        const name = (variant.attributes as Record<string, unknown>)?.name as string || '';
        const baseFeatures = { ...defaultFeatures };
        const mappedFeatures = featureMap[name] || {};
        
        return {
          id: typeof variant.id === 'string' ? parseInt(variant.id, 10) : (typeof variant.id === 'number' ? variant.id : undefined),
          name,
          description: (variant.attributes as Record<string, unknown>)?.description as string || '',
          price: typeof (variant.attributes as Record<string, unknown>)?.price === 'number' ? ((variant.attributes as Record<string, unknown>)?.price as number) / 100 : 0,
          currency: 'USD',
          billing_cycle: (variant.attributes as Record<string, unknown>)?.interval as string || 'month',
          is_active: (product.attributes as Record<string, unknown>)?.status === 'published',
          features: {
            ...baseFeatures,
            ...mappedFeatures,
          },
        };
      }))
  return variants;
}

async function cancelSubscription() {
  return await apiClient('/auth/cancel', { method: 'POST' })
}

export default function UpgradePackagesPage() {
  const { user, checkAuth } = useAuth()
  const queryClient = useQueryClient()
  const {
    data: packages,
    isLoading,
    error,
  } = useQuery<Package[]>({
    queryKey: ['public-packages'],
    queryFn: fetchPublicPackages,
  })

  const {
    mutate: cancel,
    isPending: isCancelling,
  } = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      toast.success('Subscription cancelled!')
      queryClient.invalidateQueries({ queryKey: ['public-packages'] })
      checkAuth()
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Failed to cancel subscription')
      }
    },
  })

  // New: Checkout mutation for LemonSqueezy
  const {
    mutate: startCheckout,
    isPending: isCheckingOut,
  } = useMutation({
    mutationFn: async (plan: Package) => {
      const res: { checkoutUrl?: string; checkoutId?: string } = await apiClient('/payments/create-checkout', {
        method: 'POST',
        body: JSON.stringify({
          variantId: (plan as any).variantId || plan.id, // use variantId for LemonSqueezy
          customData: {
            email: user?.email,
            name: user?.name,
            userId: user?.id,
          },
        }),
      })
      return res
    },
    onSuccess: (data: unknown) => {
      const checkoutData = data as { checkoutUrl?: string; checkoutId?: string }
      if (checkoutData?.checkoutUrl) {
        window.location.href = checkoutData.checkoutUrl
      } else {
        toast.error('Failed to start checkout')
      }
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Failed to start checkout')
      }
    },
  })

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <Spinner size={48} />
      </div>
    )
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-red-600 text-center w-full">
          Failed to load packages
        </div>
      </div>
    )
  if (!packages || packages.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-secondary-500 text-center w-full">
          No packages found.
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Upgrade Your Plan
        </h1>
        <div className="flex flex-row gap-8 overflow-x-auto pb-4 md:justify-center">
          {packages.filter(pkg => !pkg.features.is_trial).map((pkg) => {
            const isSubscribed = user?.subscription?.package?.id === pkg.id
            return (
              <PricingCard key={pkg.id} plan={pkg}>
                <CardFooter>
                  {isSubscribed ? (
                    <div className="flex flex-col gap-2 w-full">
                      <button
                        className="w-full py-2 px-4 rounded font-semibold text-white bg-green-500 cursor-default opacity-80"
                        disabled
                      >
                        Subscribed
                      </button>
                      <button
                        className="w-full py-2 px-4 rounded font-semibold text-white bg-destructive hover:bg-destructive-dark disabled:opacity-60"
                        disabled={isCancelling}
                        onClick={() => cancel()}
                      >
                        {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                      </button>
                    </div>
                  ) : (
                    <button
                      className={`w-full py-2 px-4 rounded font-semibold text-white bg-primary hover:bg-primary-dark disabled:opacity-60`}
                      disabled={isCheckingOut}
                      onClick={() => startCheckout(pkg)}
                    >
                      {isCheckingOut ? 'Redirecting...' : 'Subscribe'}
                    </button>
                  )}
                </CardFooter>
              </PricingCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}
