"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { motion } from "framer-motion"
import { useQuery } from '@tanstack/react-query'
import { Package, FEATURE_FIELDS } from '@/types/package'
import { apiClient } from '@/lib/utils/apiClient'
import { Spinner } from '@/components/ui/spinner'

const MotionCard = motion(Card)

async function fetchPublicPackages(): Promise<Package[]> {
  return await apiClient('/packages/public')
}

export function Pricing() {
  const { data: plans, isLoading, error } = useQuery<Package[]>({
    queryKey: ['public-packages'],
    queryFn: fetchPublicPackages,
  })

  if (isLoading) return (
    <section id="pricing" className="bg-gray-50 flex justify-center items-center min-h-[40vh]">
      <Spinner size={48} />
    </section>
  )
  if (error) return (
    <section id="pricing" className="bg-gray-50 flex justify-center items-center min-h-[40vh]">
      <div className="text-red-600 text-center w-full">Failed to load plans</div>
    </section>
  )
  if (!plans || plans.length === 0) return (
    <section id="pricing" className="bg-gray-50 flex justify-center items-center min-h-[40vh]">
      <div className="text-secondary-500 text-center w-full">No plans found.</div>
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
            {plans.map((plan, index) => (
              <MotionCard
                key={plan.id ?? plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="flex flex-col min-w-[320px] max-w-xs flex-shrink-0"
              >
                <CardHeader className="flex-1">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                      {plan.price === 0 ? 'Free' : `${plan.currency} $${plan.price}`}
                    </span>
                    {plan.price !== 0 && (
                      <span className="ml-1 text-sm text-muted-foreground">/ {plan.billing_cycle.toLowerCase()}</span>
                    )}
                  </div>
                  <CardDescription className="mt-4">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="grid gap-3 text-sm">
                    {FEATURE_FIELDS.filter(f => f.key !== 'is_trial').map((feature) => {
                      const value = plan.features[feature.key]
                      if (feature.type === 'boolean' && value) {
                        return (
                          <li key={feature.key} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{feature.label}</span>
                          </li>
                        )
                      }
                      if (feature.type === 'number' && typeof value === 'number') {
                        return (
                          <li key={feature.key} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{feature.label}: <span className="font-semibold">{value}</span></span>
                          </li>
                        )
                      }
                      return null
                    })}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <a href={`/register?plan=${plan.name.toLowerCase()}`}>{plan.price === 0 ? 'Get Started' : 'Start Pro Trial'}</a>
                  </Button>
                </CardFooter>
              </MotionCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
