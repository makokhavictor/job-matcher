'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/utils/apiClient'
import { Spinner } from '@/components/ui/spinner'
import { Package } from '@/types/package'
import { toast } from 'sonner'
import { useAuth } from '@/app/providers/auth-provider'
import type { User } from '@/app/providers/auth-provider'
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

async function cancelSubscription(user: User | null) {
  // Use the new API route and pass the user's subscription id
  const res = await apiClient('/api/payments/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscriptionId: user?.subscription?.id || user?.subscription?.plan_id }),
  })
  return res
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
    mutationFn: () => cancelSubscription(user),
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

  // Local state to track which plan is being checked out
  const [checkingOutPlanId, setCheckingOutPlanId] = useState<number | null>(null)
  // New: Checkout mutation for LemonSqueezy
  const {
    mutate: startCheckout,
    // Remove isPending, we'll use our own state
  } = useMutation({
    mutationFn: async (plan: Package) => {
      setCheckingOutPlanId(plan.id ?? null)
      // Use fetch for Next.js API route
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId: plan.variantId || plan.id, // use variantId for LemonSqueezy
          customData: {
            email: user?.email,
            name: user?.name,
            userId: user?.id,
          },
        }),
      })
      if (!res.ok) throw new Error('Failed to start checkout')
      const data = await res.json()
      return data as { checkoutUrl?: string; checkoutId?: string }
    },
    onSuccess: (data: unknown) => {
      setCheckingOutPlanId(null)
      const checkoutData = data as { checkoutUrl?: string; checkoutId?: string }
      if (checkoutData?.checkoutUrl) {
        window.location.href = checkoutData.checkoutUrl
      } else {
        toast.error('Failed to start checkout')
      }
    },
    onError: (err: unknown) => {
      setCheckingOutPlanId(null)
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
            const isSubscribed = user?.subscription?.plan_id === pkg.id
            const isCheckingOutThisPlan = checkingOutPlanId === pkg.id
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
                      disabled={isCheckingOutThisPlan}
                      onClick={() => startCheckout(pkg)}
                    >
                      {isCheckingOutThisPlan ? 'Redirecting...' : 'Subscribe'}
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
