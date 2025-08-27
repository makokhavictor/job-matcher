import { NextRequest, NextResponse } from 'next/server';
import { serverApiClient } from '@/lib/utils/serverApiClient';

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, variantId, invoiceImmediately } = await request.json();
    
    if (!subscriptionId || !variantId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Extract JWT token from request headers
    const authorization = request.headers.get('authorization');
    const authToken = authorization?.replace('Bearer ', '') || undefined;

    // Prepare the update request payload for backend API
    const updatePayload = {
      subscription_id: subscriptionId,
      plan_price_id: variantId,
      invoice_immediately: !!invoiceImmediately
    };

    console.log('Calling backend update subscription API with payload:', updatePayload);

    // Call the backend API using serverApiClient
    const responseData = await serverApiClient('/payments/update-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    }, authToken);

    return NextResponse.json({
      success: true,
      data: responseData
    });
  } catch (error: any) {
    console.error('Subscription update error:', error);
    
    // Handle serverApiClient errors which include status and detail
    if (error.status && error.detail) {
      return NextResponse.json(
        { error: error.detail },
        { status: error.status }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
