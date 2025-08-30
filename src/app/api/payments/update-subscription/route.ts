import { NextRequest, NextResponse } from 'next/server';
import { serverApiClient } from '@/lib/utils/serverApiClient';

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, newPlanPriceId } = await request.json();
    
    if (!subscriptionId || !newPlanPriceId) {
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
      new_plan_price_id: newPlanPriceId
    };

    console.log('Calling backend update-plan API with payload:', updatePayload);

    // Call the backend API using serverApiClient
    const responseData = await serverApiClient('/subscriptions/update-plan', {
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
  } catch (error: unknown) {
    console.error('Subscription update error:', error);
    
    // Handle serverApiClient errors which include status and detail
    if (typeof error === 'object' && error !== null && 'status' in error && 'detail' in error) {
      const errorObj = error as { status: number; detail: unknown };
      let errorMessage = 'Failed to update subscription';
      
      // Extract error message from nested detail structure
      if (typeof errorObj.detail === 'string') {
        errorMessage = errorObj.detail;
      } else if (typeof errorObj.detail === 'object' && errorObj.detail !== null) {
        const detailObj = errorObj.detail as Record<string, unknown>;
        if (typeof detailObj.message === 'string') {
          errorMessage = detailObj.message;
        } else if (typeof detailObj.detail === 'string') {
          errorMessage = detailObj.detail;
        } else if (typeof detailObj.error === 'string') {
          errorMessage = detailObj.error;
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: errorObj.status }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
