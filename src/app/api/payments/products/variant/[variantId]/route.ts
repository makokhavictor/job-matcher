// src/app/api/payments/products/variant/[variantId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getVariant } from '@/lib/payments/lemonsqueezy';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }   // <- note the Promise<>
) {
  try {
    const { variantId } = await params;   // <- await it
    if (!variantId) {
      return NextResponse.json(
        { message: 'Variant ID is required' },
        { status: 400 }
      );
    }

    const variantRes = await getVariant(Number(variantId));
    if (!variantRes.data) {
      return NextResponse.json(
        { message: 'Variant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ variant: variantRes.data });
  } catch (error) {
    console.error('Failed to fetch variant:', error);
    return NextResponse.json(
      { message: 'Failed to fetch variant' },
      { status: 500 }
    );
  }
}