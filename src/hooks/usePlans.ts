import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/utils/apiClient'
import { transformPlansToPackages, type PlanResponse } from '@/lib/utils/planTransformer'
import type { Package } from '@/types/package'

/**
 * Fetches plans from the API and transforms them to Package format
 */
async function fetchPublicPlans(): Promise<Package[]> {
  const plans: PlanResponse[] = await apiClient('/plans/public')
  const transformedPlans = transformPlansToPackages(plans)
  // Sort by display_order (ascending - lower numbers first)
  return transformedPlans.sort((a, b) => (a.display_order || 999) - (b.display_order || 999))
}

/**
 * Custom hook to fetch and manage public plans
 * 
 * @returns Object containing plans data, loading state, and error state
 */
export function usePlans() {
  const {
    data: plans,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<Package[]>({
    queryKey: ['public-plans'],
    queryFn: fetchPublicPlans,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (garbage collection time)
  })

  const plansData = plans || []

  return {
    plans: plansData,
    isLoading,
    error,
    refetch,
    isRefetching,
    hasPlans: plansData.length > 0,
  }
}

/**
 * Hook variant for filtering out trial plans
 * Useful for components that don't want to show trial/free plans
 */
export function usePlansWithoutTrial() {
  const { plans, ...rest } = usePlans()
  
  return {
    ...rest,
    plans: plans.filter((plan: Package) => !plan.features.is_trial),
  }
}
