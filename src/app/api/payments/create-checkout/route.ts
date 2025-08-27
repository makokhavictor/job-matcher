import { NextRequest, NextResponse } from 'next/server';
import { CheckoutData } from '@/types/payments';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
  try {
    const { variantId, customData }: CheckoutData = await request.json();

    if (!variantId) {
      return NextResponse.json(
        { message: 'Plan price ID is required' },
        { status: 400 }
      );
    }

    if (!BACKEND_API_URL) {
      console.error('Backend API URL is not configured');
      return NextResponse.json(
        { message: 'Backend service not configured' },
        { status: 500 }
      );
    }

    // Get user's JWT token from request headers
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json(
        { message: 'Authorization required' },
        { status: 401 }
      );
    }

    // Prepare the checkout request payload for backend API
    const checkoutPayload = {
      plan_price_id: variantId, // Use the plan_price_id from the plan
      plan_code: null, // We're using plan_price_id, so plan_code can be null
      provider: 'polar', // Default provider
      success_url: `${process.env.NEXTAUTH_URL}/dashboard`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/packages/upgrade`,
    };

    console.log('Calling backend checkout API with payload:', checkoutPayload);

    // Call the backend API
    const backendResponse = await fetch(`${BACKEND_API_URL}/payments/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization, // Forward the JWT token
      },
      body: JSON.stringify(checkoutPayload),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.text();
      console.error(`Backend API error (${backendResponse.status}):`, errorData);
      return NextResponse.json(
        { message: `Backend API error: ${errorData}` },
        { status: backendResponse.status }
      );
    }

    // Try to parse as JSON first, fallback to text if it fails
    let checkoutUrl: string;
    const contentType = backendResponse.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('application/json')) {
        // Backend returned JSON object
        const checkoutResponse = await backendResponse.json();
        console.log('Checkout JSON response from backend:', checkoutResponse);
        
        // Extract URL from various possible field names
        checkoutUrl = checkoutResponse.checkout_url || 
                     checkoutResponse.checkoutUrl || 
                     checkoutResponse.url ||
                     checkoutResponse;
      } else {
        // Backend returned plain string
        checkoutUrl = await backendResponse.text();
        console.log('Checkout text response from backend:', checkoutUrl);
        
        // Remove quotes if present
        checkoutUrl = checkoutUrl.replace(/^"|"$/g, '');
      }
    } catch (parseError) {
      // If JSON parsing fails, try as text
      console.log('Failed to parse as JSON, trying as text:', parseError);
      checkoutUrl = await backendResponse.text();
      checkoutUrl = checkoutUrl.replace(/^"|"$/g, '');
    }
    
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
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { message: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
