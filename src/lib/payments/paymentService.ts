import type { User } from "@/app/providers/auth-provider";
import { getApiPath } from "@/lib/utils";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return await res.json();
}

export async function createCheckout(variantId: number, user: User | null) {
  if (!user) throw new Error("User not found");

  const res = await fetch(getApiPath("/api/payments/create-checkout"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      variantId,
      customData: {
        email: user.email,
        name: user.name,
        userId: user.id,
      },
    }),
  });

  return handleResponse(res);
}

export async function updateSubscription(
  subscriptionId: number,
  variantId: number
) {
  const res = await fetch(getApiPath("/api/payments/update-subscription"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subscriptionId,
      variantId,
      invoiceImmediately: true,
    }),
  });

  return handleResponse(res);
}

export async function cancelSubscription(subscriptionId: number) {
  const res = await fetch(getApiPath("/api/payments/cancel"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscriptionId }),
  });

  return handleResponse(res);
}