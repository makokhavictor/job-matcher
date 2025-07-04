export interface CheckoutData {
    variantId: string;
    customData?: {
      email?: string;
      name?: string;
      userId?: string;
    };
  }
  
  export interface SubscriptionPlan {
    name: string;
    price: number;
    variantId: string;
    features: string[];
  }
  
  export interface WebhookEvent {
    meta: {
      event_name: string;
      custom_data?: Record<string, unknown>;
    };
    data: {
      id: string;
      attributes: Record<string, unknown>;
    };
  }