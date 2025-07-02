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
  return await apiClient('/packages/public')
}

async function subscribeToPlan(plan: string) {
  return await apiClient('/auth/subscribe', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  })
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
    mutate: subscribe,
    isPending: isSubscribing,
  } = useMutation({
    mutationFn: subscribeToPlan,
    onSuccess: () => {
      toast.success('Subscription successful!')
      queryClient.invalidateQueries({ queryKey: ['public-packages'] })
      checkAuth()
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Failed to subscribe')
      }
    },
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
                      disabled={isSubscribing}
                      onClick={() => subscribe(pkg.name)}
                    >
                      {isSubscribing ? 'Subscribing...' : 'Subscribe'}
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
