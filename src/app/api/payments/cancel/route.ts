import { NextRequest, NextResponse } from 'next/server';
import { serverApiClient } from '@/lib/utils/serverApiClient';

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json();
    
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Missing subscriptionId' },
        { status: 400 }
      );
    }

    // Extract JWT token from request headers
    const authorization = request.headers.get('authorization');
    const authToken = authorization?.replace('Bearer ', '') || undefined;

    // Prepare the cancel request payload for backend API
    const cancelPayload = {
      subscription_id: subscriptionId
    };

    console.log('Calling backend cancel API with payload:', cancelPayload);

    // Call the backend API using serverApiClient
    const responseData = await serverApiClient('/payments/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cancelPayload),
    }, authToken);

    return NextResponse.json({
      success: true,
      data: responseData
    });
  } catch (error: any) {
    console.error('Subscription cancellation error:', error);
    
    // Handle serverApiClient errors which include status and detail
    if (error.status && error.detail) {
      return NextResponse.json(
        { error: error.detail },
        { status: error.status }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
