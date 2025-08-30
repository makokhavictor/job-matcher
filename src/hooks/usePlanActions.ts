import { useCreateCheckout, useUpdateSubscription, useCancelSubscription } from '@/hooks/useSubscriptions'
import type { Package } from '@/types/package'
import type { User } from '@/app/providers/auth-provider'

export function usePlanActions(user: User | null, onSuccess?: () => void) {
  const { mutate: createCheckout, isPending: isCreatingCheckout } = useCreateCheckout(user)
  const { mutate: updateSubscription, isPending: isUpdatingSubscription } = useUpdateSubscription({ onSuccess })
  const { mutate: cancelSubscription, isPending: isCancelling } = useCancelSubscription({ onSuccess })

  const handlePlanChange = (plan: Package) => {
    const hasActiveSubscription = user?.subscription && user.subscription.external_subscription_id
    
    if (hasActiveSubscription) {
      // Update existing subscription
      updateSubscription({
        subscriptionId: user.subscription!.id as number, // Use non-null assertion since we checked hasActiveSubscription
        newPlanPriceId: plan.plan_price_id as number, // Use plan_price_id for backend API
      })
    } else {
      // Create new checkout for new subscribers or trial users
      if (!plan.plan_price_id) {
        throw new Error('Plan price ID is required for checkout')
      }
      createCheckout(plan.plan_price_id as number) // Use plan_price_id for backend API
    }
  }

  return {
    cancelSubscription,
    isCreatingCheckout,
    isUpdatingSubscription,
    isCancelling,
    handlePlanChange,
  }
} 