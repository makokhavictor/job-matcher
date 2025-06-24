import React from 'react'
import { Card } from '@/components/ui/card'

// Dummy data for now
const packages = [
  {
    name: 'Starter',
    description: 'Basic access for individuals',
    price: 0,
    currency: 'USD',
    billing_cycle: 'MONTHLY',
    is_active: true,
    features: { 'Support': {}, '1 Resume Analysis': {} },
  },
  {
    name: 'Pro',
    description: 'Advanced features for professionals',
    price: 19,
    currency: 'USD',
    billing_cycle: 'MONTHLY',
    is_active: true,
    features: { 'Priority Support': {}, 'Unlimited Analyses': {} },
  },
]

export function PackageList() {
  return (
    <div className="space-y-4">
      {packages.map((pkg, idx) => (
        <Card key={idx} className="p-6 flex flex-col gap-2 border border-secondary-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-700">{pkg.name}</h2>
            <span className="text-primary-600 font-bold text-xl">
              {pkg.price === 0 ? 'Free' : `${pkg.currency} $${pkg.price}`}
              <span className="text-secondary-500 text-sm ml-1">/ {pkg.billing_cycle.toLowerCase()}</span>
            </span>
          </div>
          <div className="text-secondary-700 mb-2">{pkg.description}</div>
          <ul className="list-disc pl-6 text-accent-700">
            {Object.keys(pkg.features).map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
          <div className="mt-2">
            <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${pkg.is_active ? 'bg-accent-100 text-accent-700' : 'bg-gray-200 text-gray-500'}`}>{pkg.is_active ? 'Active' : 'Inactive'}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
