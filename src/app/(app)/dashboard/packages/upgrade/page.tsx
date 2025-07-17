'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@/components/ui/spinner'
import { Package } from '@/types/package'
import { useAuth } from '@/app/providers/auth-provider'
import { PricingCard } from '@/components/marketing/PricingCard'
import { CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/utils/apiClient'
import {
  useCreateCheckout,
  useUpdateSubscription,
  useCancelSubscription,
} from '@/hooks/useSubscriptions'
import { PlanCardFooter } from '@/components/marketing/PlanCardFooter'

async function fetchPublicPackages(): Promise<Package[]> {
  return await apiClient('/packages/public')
}

export default function UpgradePackagesPage() {
  const { user, checkAuth } = useAuth()
  const {
    data: packages,
    isLoading,
    error,
  } = useQuery<Package[]>({ queryKey: ['public-packages'], queryFn: fetchPublicPackages })

  const { mutate: createCheckout, isPending: isCreatingCheckout } = useCreateCheckout(user)
  const { mutate: updateSubscription, isPending: isUpdatingSubscription } = useUpdateSubscription({ onSuccess: checkAuth })
  const { mutate: cancelSubscription, isPending: isCancelling } = useCancelSubscription({ onSuccess: checkAuth })

  const handlePlanChange = (plan: Package) => {
    const userPackageName = user?.subscription?.package?.name?.toLowerCase() || ''
    if (user?.subscription && !userPackageName.includes('trial')) {
      updateSubscription({
        subscriptionId: user.subscription.subscription_id as number,
        variantId: plan.product_id as number,
      })
    } else {
      createCheckout(plan.product_id as number)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <Spinner size={48} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-red-600 text-center w-full">Failed to load packages</div>
      </div>
    )
  }

  if (!packages || packages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-secondary-500 text-center w-full">No packages found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Upgrade Your Plan</h1>
        <div className="flex flex-row gap-8 overflow-x-auto pb-4 md:justify-center">
          {packages
            .filter((pkg) => !pkg.features.is_trial)
            .map((pkg) => {
              const isSubscribed = user?.subscription?.package.product_id === pkg.product_id
              const isProcessing = isCreatingCheckout || isUpdatingSubscription

              return (
                <PricingCard key={pkg.id} plan={pkg} active={isSubscribed}>
                  <CardFooter>
                    <PlanCardFooter
                      plan={pkg}
                      user={user}
                      isSubscribed={isSubscribed}
                      isProcessing={isProcessing}
                      isCancelling={isCancelling}
                      handlePlanChange={handlePlanChange}
                      cancelSubscription={(id) => id && cancelSubscription(id)}
                      subscriptionId={user?.subscription?.subscription_id}
                    />
                  </CardFooter>
                </PricingCard>
              )
            })}
        </div>
      </div>
    </div>
  )
}
