'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/utils/apiClient'
import { Spinner } from '@/components/ui/spinner'
import { Package } from '@/types/package'
import { FEATURE_FIELDS } from '@/types/package'

async function fetchPublicPackages(): Promise<Package[]> {
  return await apiClient('/packages/public')
}

export default function UpgradePackagesPage() {
  const {
    data: packages,
    isLoading,
    error,
  } = useQuery<Package[]>({
    queryKey: ['public-packages'],
    queryFn: fetchPublicPackages,
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
          {packages.filter(pkg => !pkg.features.is_trial).map((pkg) => (
            <div
              key={pkg.id}
              className="min-w-[300px] max-w-xs w-full h-[420px] bg-white rounded-lg shadow flex flex-col border border-secondary-200 flex-shrink-0"
            >
              {/* Top: Name & Price */}
              <div className="pt-6 px-6 text-center">
                <h2 className="text-xl font-semibold mb-2">{pkg.name}</h2>
                <div className="text-2xl font-bold mb-2">
                  {pkg.price === 0 ? 'Free' : `${pkg.currency} $${pkg.price}`}
                </div>
              </div>
              {/* Center: Features */}
              <div className="flex-1 flex items-center justify-center px-6">
                <ul className="space-y-2 text-sm text-secondary-700 w-full">
                  {FEATURE_FIELDS.filter((f) => f.key !== 'is_trial').map(
                    (feature) => {
                      const value = pkg.features[feature.key]
                      if (feature.type === 'boolean' && value) {
                        return (
                          <li
                            key={feature.key}
                            className="flex items-center justify-center"
                          >
                            <span className="mr-2 text-primary">•</span>{' '}
                            {feature.label}
                          </li>
                        )
                      }
                      if (
                        feature.type === 'number' &&
                        typeof value === 'number'
                      ) {
                        return (
                          <li
                            key={feature.key}
                            className="flex items-center justify-center"
                          >
                            <span className="mr-2 text-primary">•</span>{' '}
                            <span className="text-primary mr-2">{value}</span>{' '}
                            {feature.label}
                          </li>
                        )
                      }
                      return null
                    }
                  )}
                </ul>
              </div>
              {/* Bottom: Subscribe Button */}
              <div className="px-6 pb-6">
                <button
                  className={`w-full py-2 px-4 rounded font-semibold text-white bg-primary hover:bg-primary-dark`}
                >
                  Subscribe
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
