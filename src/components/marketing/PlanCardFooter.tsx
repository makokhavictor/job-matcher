import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Package, Subscription } from '@/types/package'
import { parseISO, format, isAfter } from 'date-fns'

interface PlanCardFooterProps {
  plan: Package
  isSubscribed: boolean
  isProcessing: boolean
  isCancelling: boolean
  handlePlanChange: (plan: Package) => void
  cancelSubscription: (subscriptionId: number | undefined) => void
  subscriptionId?: number
  subscription?: Subscription
}

export function PlanCardFooter({
  plan,
  isSubscribed,
  isProcessing,
  isCancelling,
  handlePlanChange,
  cancelSubscription,
  subscriptionId,
  subscription,
}: PlanCardFooterProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // Check if subscription is canceled but still active
  const isCanceledButActive = subscription && 
    subscription.canceled_at && 
    isAfter(parseISO(subscription.end_date), new Date());

  if (isSubscribed) {
    return (
      <div className="flex flex-col gap-1 w-full items-stretch">
        <Button
          className={`w-full cursor-default opacity-80 min-w-[160px] ${
            isCanceledButActive ? 'bg-orange-500 hover:bg-orange-500' : 'bg-green-500'
          }`}
          disabled
        >
          {isCanceledButActive ? 'Ends Soon' : 'Subscribed'}
        </Button>
        <button
          type="button"
          className="text-xs text-muted-foreground underline hover:text-primary mt-1 self-center disabled:opacity-50"
          disabled={isCancelling || !!isCanceledButActive}
          onClick={() => setShowCancelConfirm(true)}
        >
          {isCancelling 
            ? 'Cancelling...' 
            : isCanceledButActive 
              ? `Ends ${format(parseISO(subscription.end_date), 'MMM dd, yyyy')}`
              : 'Cancel Subscription'
          }
        </button>
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded shadow-lg p-6 max-w-xs w-full">
              <div className="mb-4 text-center">Are you sure you want to cancel your subscription?</div>
              <div className="flex gap-2 justify-center">
                <Button size="sm" variant="outline" onClick={() => setShowCancelConfirm(false)}>No</Button>
                <Button size="sm" variant="destructive" onClick={() => { cancelSubscription(subscriptionId); setShowCancelConfirm(false); }}>Yes, Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  return (
    <Button
      className="w-full flex-grow min-w-[160px]"
      disabled={isProcessing}
      onClick={() => handlePlanChange(plan)}
    >
      {isProcessing ? 'Processing...' : 'Subscribe'}
    </Button>
  )
} 