'use client'
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSearch, Settings, BarChart } from "lucide-react"
import { useQuery } from '@tanstack/react-query'
import { PricingCard } from '@/components/marketing/PricingCard'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/app/providers/auth-provider'
import { useAnalysisStore } from '@/stores/analysis.store'
import { CardFooter } from '@/components/ui/card'
import { apiClient } from '@/lib/utils/apiClient'
import type { Package } from '@/types/package'

async function fetchPublicPackages() {
  return await apiClient('/packages/public')
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { recentAnalyses, loading: analysesLoading, error: analysesError } = useAnalysisStore()
  const {
    data: plans,
    isLoading: plansLoading,
    error: plansError,
  } = useQuery({ queryKey: ['public-packages'], queryFn: fetchPublicPackages })

  // Find active plan for user
  const activePlanId = user?.subscription?.package?.product_id

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Job Matching</h2>
              <p className="text-sm text-secondary-600">Match your CV with jobs</p>
            </div>
          </div>
          <Link href="/dashboard/matching" className="w-full">
            <Button className="w-full mt-4">
              Start Matching
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileSearch className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Recent Analyses</h2>
              <p className="text-sm text-secondary-600">View your CV analyses</p>
            </div>
          </div>
          <Link href="/dashboard/analyses" className="w-full">
            <Button className="w-full mt-4">
              View Analyses
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Settings</h2>
              <p className="text-sm text-secondary-600">Manage your account</p>
            </div>
          </div>
          <Link href="/dashboard/settings" className="w-full">
            <Button className="w-full mt-4">
              Open Settings
            </Button>
          </Link>
        </Card>
      </div>

      {/* Plans Overview Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 mt-8">
        {plansLoading ? (
          <div className="col-span-3 flex justify-center items-center min-h-[200px]"><Spinner size={32} /></div>
        ) : plansError ? (
          <div className="col-span-3 text-red-600">Failed to load plans</div>
        ) : plans ? (
          (plans as Package[]).filter((plan: Package) => !plan.features.is_trial).map((plan: Package, idx: number) => (
            <PricingCard key={plan.id || idx} plan={plan} active={activePlanId === plan.product_id}>
              <CardFooter>
                {activePlanId === plan.product_id ? (
                  <Button className="w-full bg-green-500 cursor-default opacity-80" disabled>Current Plan</Button>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href="/dashboard/packages/upgrade">Upgrade</Link>
                  </Button>
                )}
              </CardFooter>
            </PricingCard>
          ))
        ) : null}
      </div>

      {/* Recent Activity Section */}
      <Card className="p-6 mt-8">
        <h3 className="font-semibold text-base mb-4">Recent Activity</h3>
        {analysesLoading ? (
          <div className="flex justify-center items-center min-h-[80px]"><Spinner size={24} /></div>
        ) : analysesError ? (
          <div className="text-red-600">{analysesError}</div>
        ) : recentAnalyses && recentAnalyses.length > 0 ? (
          <div className="divide-y divide-secondary-200">
            {recentAnalyses.slice(0, 3).map((a) => (
              <div key={a.id} className="flex justify-between py-2 text-sm">
                <span>{a.result_data?.title || a.input_data.cv_filename || 'Untitled'}</span>
                <span className="text-xs">Match: {a.result_data?.match_score ?? 'N/A'}%</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-secondary-500">No recent analyses found.</div>
        )}
      </Card>
    </div>
  )
}
