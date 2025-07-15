import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// --- Lemonsqueezy Webhook Types ---

export interface WebhookPayload<T> {
  meta: {
    event_name: string;
    custom_data?: Record<string, unknown>;
  };
  data: {
    type: string;
    id: string;
    attributes: T;
  };
}

export interface SubscriptionAttributes {
  status: 'active' | 'cancelled' | 'expired' | 'past_due' | 'on_trial' | 'unpaid' | 'paused';
  variant_id: number;
  user_email: string;
  user_name: string;
  renews_at: string;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  cancelled: boolean;
  card_brand: string | null;
  card_last_four: string | null;
  is_usage_based: boolean;
}

export type SubscriptionWebhookPayload = WebhookPayload<SubscriptionAttributes>;

const LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
const BACKEND_API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

// --- Utility for sending data to the backend ---
async function sendToBackend(endpoint: string, payload: object) {
  if (!BACKEND_API_URL || !BACKEND_API_KEY) {
    console.error('Backend API URL or Key is not configured.');
    throw new Error('Backend service is not configured.');
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': BACKEND_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send data to backend endpoint ${endpoint}:`, errorText);
      throw new Error(`Backend returned ${response.status}: ${errorText}`);
    }
    
    console.log(`Successfully sent data to backend endpoint: ${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error(`Error sending data to backend endpoint ${endpoint}:`, error);
    throw error;
  }
}

// --- Event Handlers ---

async function handleSubscriptionCreated(eventName: string, payload: SubscriptionWebhookPayload) {
  const attributes = payload.data.attributes;
  const subscriptionPayload = {
    user_email: attributes.user_email,
    package_id: attributes.variant_id,
    status: (attributes.status as string).toUpperCase(),
    start_date: attributes.created_at,
    end_date: attributes.renews_at,
    renewal_date: attributes.renews_at,
    subscription_id: payload.data.id,
    is_usage_based: attributes.is_usage_based,
    event_name: eventName,
  };
  
  await sendToBackend('/subscriptions/webhook-subscription', subscriptionPayload);
}

async function handleSubscriptionPlanChanged(eventName: string, payload: SubscriptionWebhookPayload) {
  const attributes = payload.data.attributes;
  const subscriptionPayload = {
    user_email: attributes.user_email,
    package_id: attributes.variant_id,
    status: (attributes.status as string).toUpperCase(),
    start_date: attributes.created_at,
    end_date: attributes.renews_at,
    renewal_date: attributes.renews_at,
    subscription_id: payload.data.id,
    is_usage_based: attributes.is_usage_based,
    event_name: eventName,
  };
  
  await sendToBackend('/subscriptions/webhook-subscription', subscriptionPayload);
}

async function handleSubscriptionCancelled(eventName: string, payload: SubscriptionWebhookPayload) {
  const attributes = payload.data.attributes;
  await sendToBackend('/subscriptions/cancel', {
    subscription_id: payload.data.id,
    user_email: attributes.user_email,
  });
}

// --- Event Handler Map ---
const eventHandlers: { [key: string]: (eventName: string, payload: SubscriptionWebhookPayload) => Promise<void> } = {
  'subscription_created': handleSubscriptionCreated,
  'subscription_resumed': handleSubscriptionCreated,
  'subscription_plan_changed': handleSubscriptionPlanChanged,
  'subscription_cancelled': handleSubscriptionCancelled,
};

// --- Main Webhook POST Function ---
export async function POST(request: NextRequest) {
  if (!LEMON_SQUEEZY_WEBHOOK_SECRET) {
    console.error('LEMON_SQUEEZY_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  try {
    const rawBody = await request.text();
    const signature = request.headers.get('X-Signature');

    if (!signature) {
      
      return NextResponse.json({ error: 'Missing signature header' }, { status: 400 });
    }

    const hmac = crypto.createHmac('sha256', LEMON_SQUEEZY_WEBHOOK_SECRET);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const receivedSignature = Buffer.from(signature, 'utf8');

    if (!crypto.timingSafeEqual(digest, receivedSignature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const body = JSON.parse(rawBody) as SubscriptionWebhookPayload;
    const eventName = body.meta.event_name;
    console.log({eventName}, 'received');

    const handler = eventHandlers[eventName];

    if (handler) {
      console.log(`Handling event: ${eventName}`);
      await handler(eventName, body);
    } else {
      console.log(`No handler for event: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling LemonSqueezy webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process webhook';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
