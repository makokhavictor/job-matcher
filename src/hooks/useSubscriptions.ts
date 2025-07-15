import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCheckout,
  updateSubscription,
  cancelSubscription,
} from "@/lib/payments/paymentService";
import type { User } from "@/app/providers/auth-provider";

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useCreateCheckout(user: User | null) {
  return useMutation({
    mutationFn: (variantId: number) => createCheckout(variantId, user),
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to start checkout");
      }
    },
  });
}

export function useUpdateSubscription({ onSuccess }: MutationCallbacks = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subscriptionId, variantId }: { subscriptionId: number, variantId: number }) =>
      updateSubscription(subscriptionId, variantId),
    onSuccess: () => {
      toast.success(
        'Your subscription has been updated! Changes will take effect within 2 minutes. Please refresh the page if you do not see the update.'
      );
      queryClient.invalidateQueries({ queryKey: ["public-packages"] });
      onSuccess?.();
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to update subscription");
      }
    },
  });
}

export function useCancelSubscription({ onSuccess }: MutationCallbacks = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subscriptionId: number) => cancelSubscription(subscriptionId),
    onSuccess: () => {
      toast.success(
        'Your subscription has been cancelled. Changes will take effect within 2 minutes. Please refresh the page if you do not see the update.'
      );
      queryClient.invalidateQueries({ queryKey: ["public-packages"] });
      onSuccess?.();
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to cancel subscription");
      }
    },
  });
}
