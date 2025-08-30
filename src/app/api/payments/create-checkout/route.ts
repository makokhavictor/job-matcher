import { NextRequest, NextResponse } from 'next/server';
import { CheckoutData } from '@/types/payments';
import { isApiError, serverApiClient } from '@/lib/utils/serverApiClient';

export async function POST(request: NextRequest) {
  try {
    const { variantId }: CheckoutData = await request.json();

    if (!variantId) {
      return NextResponse.json(
        { message: 'Plan price ID is required' },
        { status: 400 }
      );
    }

    // Extract JWT token from request headers
    const authorization = request.headers.get('authorization');
    const authToken = authorization?.replace('Bearer ', '') || undefined;

    // Prepare the checkout request payload for backend API
    const checkoutPayload = {
      plan_price_id: variantId, // Use the plan_price_id from the plan
      plan_code: null, // We're using plan_price_id, so plan_code can be null
      provider: 'polar', // Default provider
      success_url: `${process.env.NEXTAUTH_URL}/dashboard`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/packages/upgrade`,
    };

    console.log('Calling backend checkout API with payload:', checkoutPayload);

    // Call the backend API using serverApiClient
    const checkoutResponse = await serverApiClient('/payments/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutPayload),
    }, authToken);

    console.log('Checkout response from backend:', checkoutResponse);
    
    // Extract URL from various possible field names
    const checkoutUrl = checkoutResponse.checkout_url || 
                     checkoutResponse.checkoutUrl || 
                     checkoutResponse.url ||
                     checkoutResponse;
    
    if (!checkoutUrl || typeof checkoutUrl !== 'string') {
      console.error('Invalid checkout URL received from backend:', checkoutUrl);
      return NextResponse.json(
        { message: 'Invalid checkout URL received from backend' },
        { status: 500 }
      );
    }
    
    // Validate that it's a proper URL
    try {
      new URL(checkoutUrl);
    } catch (urlError) {
      console.error('Invalid URL format:', checkoutUrl, urlError);
      return NextResponse.json(
        { message: `Invalid URL format: ${checkoutUrl}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutUrl: checkoutUrl,
      checkoutId: null, // Backend doesn't return checkout ID
    });
  } catch (error: unknown) {
    console.error('Checkout creation error:', error);
    
    // Handle apiClient errors which include status and detail
    if (isApiError(error)) {
      return NextResponse.json(
        { message: error.detail },
        { status: error.status }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
