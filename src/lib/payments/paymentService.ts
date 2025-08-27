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

  // Get JWT token from localStorage
  const auth = localStorage.getItem('auth');
  const token = auth ? JSON.parse(auth).access_token : null;

  const headers: Record<string, string> = { 
    "Content-Type": "application/json" 
  };
  
  // Add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(getApiPath("/api/payments/create-checkout"), {
    method: "POST",
    headers,
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
  // Get JWT token from localStorage
  const auth = localStorage.getItem('auth');
  const token = auth ? JSON.parse(auth).access_token : null;

  const headers: Record<string, string> = { 
    "Content-Type": "application/json" 
  };
  
  // Add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(getApiPath("/api/payments/update-subscription"), {
    method: "POST",
    headers,
    body: JSON.stringify({
      subscriptionId,
      variantId,
      invoiceImmediately: true,
    }),
  });

  return handleResponse(res);
}

export async function cancelSubscription(subscriptionId: number) {
  // Get JWT token from localStorage
  const auth = localStorage.getItem('auth');
  const token = auth ? JSON.parse(auth).access_token : null;

  const headers: Record<string, string> = { 
    "Content-Type": "application/json" 
  };
  
  // Add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(getApiPath("/api/payments/cancel"), {
    method: "POST",
    headers,
    body: JSON.stringify({ subscriptionId }),
  });

  return handleResponse(res);
}
