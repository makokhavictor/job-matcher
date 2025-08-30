import { useState } from 'react'
import { PricingCard } from './PricingCard'
import { PlanCardFooter } from './PlanCardFooter'
import { Spinner } from '@/components/ui/spinner'
import { usePlanActions } from '@/hooks/usePlanActions'
import { usePlans } from '@/hooks/usePlans'
import type { User } from '@/app/providers/auth-provider'
import type { Package } from '@/types/package'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface PlansGridProps {
  user: User | null
  title?: string
  className?: string
}

type PlanChangeType = 'upgrade' | 'downgrade' | 'new'

interface PlanChangeConfirmation {
  plan: Package
  changeType: PlanChangeType
  currentPrice: number
  newPrice: number
  priceDifference: number
}

export function PlansGrid({ user, title, className }: PlansGridProps) {
  const { plans, isLoading, error } = usePlans()
  const [confirmationData, setConfirmationData] = useState<PlanChangeConfirmation | null>(null)

  const {
    cancelSubscription,
    isCreatingCheckout,
    isUpdatingSubscription,
    isCancelling,
    handlePlanChange,
  } = usePlanActions(user)

  const activePlanId = user?.subscription?.plan_id

  // Helper function to normalize price to monthly equivalent for comparison
  const normalizeToMonthlyPrice = (price: number, billingCycle: string): number => {
    const cycle = billingCycle.toLowerCase()
    if (cycle.includes('year') || cycle.includes('annual')) {
      return price / 12
    }
    if (cycle.includes('week')) {
      return price * 4.33 // Approximate weeks per month
    }
    return price // Assume monthly or one-time
  }

  // Determine if plan change is upgrade, downgrade, or new subscription
  const determinePlanChangeType = (newPlan: Package): PlanChangeConfirmation => {
    if (!user?.subscription) {
      return {
        plan: newPlan,
        changeType: 'new',
        currentPrice: 0,
        newPrice: newPlan.price,
        priceDifference: newPlan.price
      }
    }

    const currentPlan = plans?.find(p => p.id === user.subscription?.plan_id)
    if (!currentPlan) {
      return {
        plan: newPlan,
        changeType: 'new',
        currentPrice: 0,
        newPrice: newPlan.price,
        priceDifference: newPlan.price
      }
    }

    // Normalize both prices to monthly equivalent for fair comparison
    const currentMonthlyPrice = normalizeToMonthlyPrice(currentPlan.price, currentPlan.billing_cycle)
    const newMonthlyPrice = normalizeToMonthlyPrice(newPlan.price, newPlan.billing_cycle)
    
    const changeType: PlanChangeType = newMonthlyPrice > currentMonthlyPrice ? 'upgrade' : 'downgrade'
    const priceDifference = newPlan.price - currentPlan.price

    return {
      plan: newPlan,
      changeType,
      currentPrice: currentPlan.price,
      newPrice: newPlan.price,
      priceDifference
    }
  }

  // Handle plan change with confirmation
  const handlePlanChangeWithConfirmation = (plan: Package) => {
    // If user is already subscribed to this plan, do nothing
    if (activePlanId === plan.id) {
      return
    }

    // If no user or subscription, proceed directly (new subscription)
    if (!user?.subscription) {
      handlePlanChange(plan)
      return
    }

    // Show confirmation dialog for existing subscribers
    const confirmationData = determinePlanChangeType(plan)
    setConfirmationData(confirmationData)
  }

  // Handle confirmation
  const handleConfirmPlanChange = () => {
    if (confirmationData) {
      handlePlanChange(confirmationData.plan)
      setConfirmationData(null)
    }
  }

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  }

  return (
    <div className={className}>
      {title && <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-3 flex justify-center items-center min-h-[200px]"><Spinner size={32} /></div>
        ) : error ? (
          <div className="col-span-3 text-red-600">Failed to load plans</div>
        ) : plans ? (
          plans.map((plan, idx) => {
            const isSubscribed = activePlanId === plan.id
            const isProcessing = isCreatingCheckout || isUpdatingSubscription
            return (
              <PricingCard 
                key={plan.id || idx} 
                plan={plan} 
                active={isSubscribed}
                subscription={user?.subscription}
              >
                <PlanCardFooter
                  plan={plan}
                  isSubscribed={isSubscribed}
                  isProcessing={isProcessing}
                  isCancelling={isCancelling}
                  handlePlanChange={handlePlanChangeWithConfirmation}
                  cancelSubscription={(id) => id && cancelSubscription(id)}
                  subscriptionId={user?.subscription?.id}
                  subscription={user?.subscription}
                />
              </PricingCard>
            )
          })
        ) : null}
      </div>

      {/* Plan Change Confirmation Dialog */}
      <Dialog open={!!confirmationData} onOpenChange={() => setConfirmationData(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirmationData?.changeType === 'upgrade' ? '🚀 Upgrade Plan' : '📉 Downgrade Plan'}
            </DialogTitle>
            <DialogDescription>
              {confirmationData?.changeType === 'upgrade' ? (
                <div className="space-y-3 text-sm">
                  <p>
                    You&rsquo;re upgrading to <strong>{confirmationData.plan.name}</strong>.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-md border border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <span>Current plan:</span>
                      <span className="font-medium">{formatPrice(confirmationData.currentPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>New plan:</span>
                      <span className="font-medium">{formatPrice(confirmationData.newPrice)}</span>
                    </div>
                    {confirmationData.priceDifference > 0 && (
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium">You will be charged:</span>
                        <span className="font-bold text-foreground">
                          {formatPrice(Math.abs(confirmationData.priceDifference))}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 The charge will be prorated based on your remaining billing period, and you&rsquo;ll get immediate access to all new features.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <p>
                    You&rsquo;re downgrading to <strong>{confirmationData?.plan.name}</strong>.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-md border border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <span>Current plan:</span>
                      <span className="font-medium">{formatPrice(confirmationData?.currentPrice || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>New plan:</span>
                      <span className="font-medium">{formatPrice(confirmationData?.newPrice || 0)}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-md border border-gray-200 dark:border-gray-800">
                    <p className="font-medium mb-1">
                      🎉 Good news!
                    </p>
                    <p className="text-muted-foreground text-xs">
                      You&rsquo;ll continue to enjoy your current plan until the end of your billing cycle. The downgrade will take effect on your next renewal date.
                    </p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:space-x-0 sm:flex-col sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmationData(null)}
              className="w-full sm:w-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPlanChange}
              disabled={isUpdatingSubscription}
              className="w-full sm:w-full"
            >
              {isUpdatingSubscription ? (
                <div className="flex items-center gap-2">
                  <Spinner size={16} />
                  Processing...
                </div>
              ) : (
                confirmationData?.changeType === 'upgrade' ? 'Confirm Upgrade' : 'Confirm Downgrade'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
