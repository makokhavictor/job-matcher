import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Package } from '@/types/package'

interface PlanCardFooterProps {
  plan: Package
  isSubscribed: boolean
  isProcessing: boolean
  isCancelling: boolean
  handlePlanChange: (plan: Package) => void
  cancelSubscription: (subscriptionId: number | undefined) => void
  subscriptionId?: number
}

export function PlanCardFooter({
  plan,
  isSubscribed,
  isProcessing,
  isCancelling,
  handlePlanChange,
  cancelSubscription,
  subscriptionId,
}: PlanCardFooterProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  if (isSubscribed) {
    return (
      <div className="flex flex-col gap-1 w-full items-stretch">
        <Button
          className="w-full bg-green-500 cursor-default opacity-80 min-w-[160px]"
          disabled
        >
          Subscribed
        </Button>
        <button
          type="button"
          className="text-xs text-muted-foreground underline hover:text-primary mt-1 self-center disabled:opacity-50"
          disabled={isCancelling}
          onClick={() => setShowCancelConfirm(true)}
        >
          {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
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