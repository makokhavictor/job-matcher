// app/api/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { CheckoutData } from '@/types/payments';

export async function POST(request: NextRequest) {
  try {
    const { variantId, customData }: CheckoutData = await request.json();

    if (!variantId) {
      return NextResponse.json(
        { message: 'Variant ID is required' },
        { status: 400 }
      );
    }

    const checkout = await createCheckout(
      process.env.LEMONSQUEEZY_STORE_ID!,
      variantId,
      {
        checkoutOptions: {
          embed: true,
          media: true,
          logo: true,
        },
        checkoutData: {
          email: customData?.email,
          name: customData?.name,
          custom: customData,
        },
        productOptions: {
          enabledVariants: [+variantId],
          redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
          receiptButtonText: 'Go to Dashboard',
          receiptThankYouNote: 'Thank you for your purchase!',
        },
      }
    );

    return NextResponse.json({
      checkoutUrl: checkout.data?.data.attributes.url,
      checkoutId: checkout.data?.data.id,
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { message: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}