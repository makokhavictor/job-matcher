'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Spinner } from '@/components/ui/spinner'
import { Package } from '@/types/package'
import { toast } from 'sonner'
import { useAuth } from '@/app/providers/auth-provider'
import type { User } from '@/app/providers/auth-provider'
import { PricingCard } from '@/components/marketing/PricingCard'
import { CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/utils/apiClient'


async function fetchPublicPackages(): Promise<Package[]> {
  return await apiClient('/packages/public')
}

async function cancelSubscription(user: User | null) {
  const res = await fetch('/api/payments/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscriptionId: user?.subscription?.subscription_id }),
  })
  if (!res.ok) throw new Error('Failed to cancel subscription')
  return res.json()
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
          variantId: plan.product_id || plan.id, // use variantId for LemonSqueezy
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
                      <Button
                        className="w-full bg-green-500 cursor-default opacity-80"
                        disabled
                      >
                        Subscribed
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        disabled={isCancelling}
                        onClick={() => cancel()}
                      >
                        {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={isCheckingOutThisPlan}
                      onClick={() => startCheckout(pkg)}
                    >
                      {isCheckingOutThisPlan ? 'Redirecting...' : 'Subscribe'}
                    </Button>
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
