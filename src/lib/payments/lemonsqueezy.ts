// lib/lemonsqueezy.js
import { lemonSqueezySetup, listProducts, listVariants, getVariant, cancelSubscription, updateSubscription as sdkUpdateSubscription } from '@lemonsqueezy/lemonsqueezy.js';

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY,
  onError: (error) => {
    console.error('Lemon Squeezy Error:', error);
  },
});

export { lemonSqueezySetup, listProducts, listVariants, getVariant, cancelSubscription };

/**
 * Updates a LemonSqueezy subscription to a new product/variant (plan), with proration.
 * @param subscriptionId The LemonSqueezy subscription ID
 * @param productId The new product ID
 * @param variantId The new variant ID
 * @param invoiceImmediately If true, charge proration immediately; otherwise, add to next renewal
 * @returns The updated subscription object or error
 */
export async function updateSubscription({
  subscriptionId,
  // productId is not needed for the SDK call, so remove it
  variantId,
  invoiceImmediately = false,
}: {
  subscriptionId: number | string
  variantId: number | string
  invoiceImmediately?: boolean
}) {
  try {
    const result = await sdkUpdateSubscription(subscriptionId, {
      variantId: Number(variantId),
      invoiceImmediately,
    })
    return { data: result }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update subscription'
    return { error: message, data: error }
  }
}