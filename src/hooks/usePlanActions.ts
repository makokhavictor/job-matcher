import { useCreateCheckout, useUpdateSubscription, useCancelSubscription } from '@/hooks/useSubscriptions'
import type { Package } from '@/types/package'
import type { User } from '@/app/providers/auth-provider'

export function usePlanActions(user: User | null, onSuccess?: () => void) {
  const { mutate: createCheckout, isPending: isCreatingCheckout } = useCreateCheckout(user)
  const { mutate: updateSubscription, isPending: isUpdatingSubscription } = useUpdateSubscription({ onSuccess })
  const { mutate: cancelSubscription, isPending: isCancelling } = useCancelSubscription({ onSuccess })

  const handlePlanChange = (plan: Package) => {
    const userPackageName = user?.subscription?.package?.name?.toLowerCase() || ''
    if (user?.subscription && !userPackageName.includes('trial')) {
      updateSubscription({
        subscriptionId: user.subscription.subscription_id as number,
        variantId: plan.product_id as number,
      })
    } else {
      createCheckout(plan.product_id as number)
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