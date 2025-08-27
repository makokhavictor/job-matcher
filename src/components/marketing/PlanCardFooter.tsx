import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
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
        
        {/* Cancel Subscription Confirmation Dialog */}
        <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-destructive">⚠️</span>
                Cancel Subscription
              </DialogTitle>
              <DialogDescription className="space-y-2">
                <p>Are you sure you want to cancel your subscription to <strong>{plan.name}</strong>?</p>
                <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-md border border-gray-200 dark:border-gray-800">
                  <div className="text-sm font-medium">
                    <strong>What happens next:</strong>
                  </div>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                    <li>• You&rsquo;ll keep access until {subscription?.end_date ? format(parseISO(subscription.end_date), 'MMM dd, yyyy') : 'your billing period ends'}</li>
                    <li>• No future charges will be made</li>
                    <li>• You can resubscribe anytime</li>
                  </ul>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:space-x-0 sm:flex-col-reverse sm:gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(false)}
                className="w-full sm:w-full"
              >
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  cancelSubscription(subscriptionId)
                  setShowCancelConfirm(false)
                }}
                disabled={isCancelling}
                className="w-full sm:w-full"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel Subscription'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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