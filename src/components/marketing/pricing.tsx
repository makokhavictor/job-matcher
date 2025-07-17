'use client'

import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { Package } from '@/types/package'
import { apiClient } from '@/lib/utils/apiClient'
import { Spinner } from '@/components/ui/spinner'
import { PricingCard } from './PricingCard'
import { motion } from 'framer-motion'
import { freePlan } from '@/types/package';

async function fetchPublicPackages(): Promise<Package[]> {
  return await apiClient('/packages/public')
}

export function Pricing() {
  const {
    data: plans,
    isLoading,
    error,
  } = useQuery<Package[]>({
    queryKey: ['public-packages'],
    queryFn: fetchPublicPackages,
  })

  if (isLoading)
    return (
      <section
        id="pricing"
        className="bg-gray-50 flex justify-center items-center min-h-[40vh]"
      >
        <Spinner size={48} />
      </section>
    )
  if (error)
    return (
      <section
        id="pricing"
        className="bg-gray-50 flex justify-center items-center min-h-[40vh]"
      >
        <div className="text-red-600 text-center w-full">
          Failed to load plans
        </div>
      </section>
    )
  if (!plans || plans.length === 0)
    return (
      <section
        id="pricing"
        className="bg-gray-50 flex justify-center items-center min-h-[40vh]"
      >
        <div className="text-secondary-500 text-center w-full">
          No plans found.
        </div>
      </section>
    )

  return (
    <section id="pricing" className="bg-gray-50 flex justify-center">
      <div className="container px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="mx-auto mb-12 flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-bold text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg">
            Choose the perfect plan for your job search needs
          </p>
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-row gap-6 overflow-x-auto pb-4 md:justify-center">
            {/* Static Free Plan Card */}
            <motion.div
              key="free-plan"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0 }}
              viewport={{ once: true }}
            >
              <PricingCard plan={freePlan}>
                <Button asChild className="w-full">
                  <a href="/register?plan=free">Start Now</a>
                </Button>
              </PricingCard>
            </motion.div>
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id || index} // Use plan.id if available, fallback to index
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <PricingCard plan={plan}>
                  <Button asChild className="w-full">
                    <a href={`/register?plan=${plan.name.toLowerCase()}`}>
                      {plan.price === 0 ? 'Get Started' : 'Start Now'}
                    </a>
                  </Button>
                </PricingCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
