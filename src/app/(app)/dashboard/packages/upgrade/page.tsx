'use client'

import React from 'react'
import { PlansGrid } from '@/components/marketing/PlansGrid'
import { useAuth } from '@/app/providers/auth-provider'

export default function UpgradePackagesPage() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <PlansGrid user={user} title="Upgrade Your Plan" />
      </div>
    </div>
  )
}
