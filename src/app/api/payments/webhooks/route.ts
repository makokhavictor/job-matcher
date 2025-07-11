import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Get your signing secret from environment variables
// IMPORTANT: Make sure this environment variable is set in your deployment environment!
const LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  // Ensure the secret is set
  if (!LEMON_SQUEEZY_WEBHOOK_SECRET) {
    console.error('LEMON_SQUEEZY_WEBHOOK_SECRET is not set in environment variables.');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  try {
    // 1. Get the raw request body as text
    const rawBody = await request.text();

    // 2. Get the signature from the 'X-Signature' header
    const signature = request.headers.get('X-Signature');

    // 3. Check if signature exists
    if (!signature) {
      console.warn('Webhook received without X-Signature header.');
      return NextResponse.json({ error: 'Missing signature header' }, { status: 400 });
    }

    // 4. Compute the HMAC-SHA256 hash of the raw body using your secret
    const hmac = crypto.createHmac('sha256', LEMON_SQUEEZY_WEBHOOK_SECRET);
    hmac.update(rawBody);
    const digest = hmac.digest('hex');

    // 5. Compare the computed digest with the received signature
    if (digest !== signature) {
      console.warn('Webhook signature mismatch. Request might be tampered with.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 }); // Forbidden
    }

    // Signature is valid, now parse the body
    const body = JSON.parse(rawBody);
    console.log('LemonSqueezy Webhook received (signature verified):', body);
   

    // Check event type for subscription events
    const eventName = body?.meta?.event_name;
    if (
      eventName === 'subscription_created' ||
      eventName === 'subscription_updated' ||
      eventName === 'subscription_resumed'
    ) {
      console.log('Subscription created/updated/resumed:', body);
      // Implement your business logic here for new or updated subscriptions
      const attributes = body.data.attributes;
      // Set end_date to renewal_date (renews_at)
      const endDate = attributes.renews_at;

      const subscriptionPayload = {
        user_email: attributes.user_email, // Python backend should look up user by email
        package_id: attributes.variant_id,
        status: (attributes.status as string).toUpperCase(),
        start_date: attributes.created_at,
        end_date: endDate,
        canceled_at: attributes.cancelled ? new Date().toISOString() : null,
        renewal_date: attributes.renews_at,
        payment_method: attributes.card_brand
          ? `${attributes.card_brand} ${attributes.card_last_four}`
          : null,
      };
      // Send to Python backend
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      const apiKey = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
      try {
        const resp = await fetch(`${backendUrl}/subscriptions/webhook-subscription`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || '',
          },
          body: JSON.stringify(subscriptionPayload),
        });
        if (!resp.ok) {
          const errorText = await resp.text();
          console.error('Failed to save subscription to backend:', errorText);
        }
      } catch (err) {
        console.error('Error sending subscription to backend:', err);
      }
    } else if (
      eventName === 'subscription_cancelled' ||
      eventName === 'subscription_expired' ||
      eventName === 'subscription_paused'
    ) {
      console.log('Subscription cancelled/expired/paused:', body);
      // Implement your business logic here for cancelled, expired, or paused subscriptions
    } else if (eventName === 'subscription_payment_successful') {
      console.log('Subscription payment successful:', body);
      // Implement your business logic here for successful subscription payments
    } else if (eventName === 'subscription_payment_failed') {
      console.log('Subscription payment failed:', body);
      // Implement your business logic here for failed subscription payments
    } else {
      console.log('Other LemonSqueezy event:', eventName);
      // Handle other events as needed
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling LemonSqueezy webhook:', error);
    // Be careful not to expose too much internal error detail in production
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

// IMPORTANT: For Next.js App Router, you might need to configure body parsing.
// This is typically done in a `route.ts` file.
// The default body parser for Next.js API routes (App Router) correctly handles `request.text()`.
// If you were using Pages Router API routes, you might need `bodyParser: false` in `config`.