// app/api/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createCheckout, type NewCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { lemonSqueezySetup } from '@/lib/payments/lemonsqueezy';
import { CheckoutData } from '@/types/payments';

export async function POST(request: NextRequest) {
  // Ensure LemonSqueezy is set up
  lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY!, // assumes .env is set
    onError: (error) => {
      console.error('Lemon Squeezy Error:', error);
    },
  });
  try {
    const { variantId, customData }: CheckoutData = await request.json();

    if (!variantId) {
      return NextResponse.json(
        { message: 'Variant ID is required' },
        { status: 400 }
      );
    }

    let checkout;
    try {
      const checkoutPayload: NewCheckout = {
          checkoutOptions: {
            embed: true,
            media: true,
            logo: true,
          },
          checkoutData: {
            email: customData?.email,
            name: customData?.name,
          },
          productOptions: {
            enabledVariants: [+variantId],
            redirectUrl: `${process.env.NEXTAUTH_URL}/dashboard`,
            receiptButtonText: 'Go to Dashboard',
            receiptThankYouNote: 'Thank you for your purchase!',
          },
      }

      console.log(checkoutPayload);
      checkout = await createCheckout(
        +process.env.LEMONSQUEEZY_STORE_ID!,
        variantId,
        checkoutPayload
      );
      console.log(checkout);
    } catch (err) {
      console.log('Error in createCheckout:');
      console.log(err);
      throw err;
    }

    return NextResponse.json({
      checkoutUrl: checkout.data?.data?.attributes.url,
      checkoutId: checkout.data?.data?.id,
    });
  } catch (error) {
    console.log('Checkout creation error:');
    console.log(error)
    return NextResponse.json(
      { message: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}