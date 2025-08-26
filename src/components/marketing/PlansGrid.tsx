import { PricingCard } from './PricingCard'
import { PlanCardFooter } from './PlanCardFooter'
import { Spinner } from '@/components/ui/spinner'
import { usePlanActions } from '@/hooks/usePlanActions'
import { usePlans } from '@/hooks/usePlans'
import type { User } from '@/app/providers/auth-provider'

interface PlansGridProps {
  user: User | null
  title?: string
  className?: string
}

export function PlansGrid({ user, title, className }: PlansGridProps) {
  const { plans, isLoading, error } = usePlans()

  const {
    cancelSubscription,
    isCreatingCheckout,
    isUpdatingSubscription,
    isCancelling,
    handlePlanChange,
  } = usePlanActions(user)

  const activePlanId = user?.subscription?.plan_id

  return (
    <div className={className}>
      {title && <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-3 flex justify-center items-center min-h-[200px]"><Spinner size={32} /></div>
        ) : error ? (
          <div className="col-span-3 text-red-600">Failed to load plans</div>
        ) : plans ? (
          plans.map((plan, idx) => {
            const isSubscribed = activePlanId === plan.id
            const isProcessing = isCreatingCheckout || isUpdatingSubscription
            return (
              <PricingCard key={plan.id || idx} plan={plan} active={isSubscribed}>
                <PlanCardFooter
                  plan={plan}
                  isSubscribed={isSubscribed}
                  isProcessing={isProcessing}
                  isCancelling={isCancelling}
                  handlePlanChange={handlePlanChange}
                  cancelSubscription={(id) => id && cancelSubscription(id)}
                  subscriptionId={user?.subscription?.id}
                />
              </PricingCard>
            )
          })
        ) : null}
      </div>
    </div>
  )
} 