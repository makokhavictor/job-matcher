import { useCreateCheckout, useUpdateSubscription, useCancelSubscription } from '@/hooks/useSubscriptions'
import type { Package } from '@/types/package'
import type { User } from '@/app/providers/auth-provider'

export function usePlanActions(user: User | null, onSuccess?: () => void) {
  const { mutate: createCheckout, isPending: isCreatingCheckout } = useCreateCheckout(user)
  const { mutate: updateSubscription, isPending: isUpdatingSubscription } = useUpdateSubscription({ onSuccess })
  const { mutate: cancelSubscription, isPending: isCancelling } = useCancelSubscription({ onSuccess })

  const handlePlanChange = (plan: Package) => {
    // Check if user has a subscription and it's not a trial
    const userPlanType = user?.subscription?.plan?.plan_type?.toLowerCase() || ''
    const hasActiveSubscription = user?.subscription && user.subscription.external_subscription_id
    
    if (hasActiveSubscription && userPlanType !== 'trial') {
      // Update existing subscription
      updateSubscription({
        subscriptionId: user.subscription!.id as number, // Use non-null assertion since we checked hasActiveSubscription
        variantId: plan.id as number, // Use plan.id instead of product_id
      })
    } else {
      // Create new checkout for new subscribers or trial users
      createCheckout(plan.id as number) // Use plan.id instead of product_id
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