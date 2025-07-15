import { NextRequest, NextResponse } from 'next/server'
import { updateSubscription } from '@/lib/payments/lemonsqueezy'

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId, variantId, invoiceImmediately } = await req.json()
    if (!subscriptionId || !variantId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const result = await updateSubscription({
      subscriptionId,
      variantId,
      invoiceImmediately: !!invoiceImmediately,
    })
    if (result.error) {
      return NextResponse.json({ error: result.error, data: result.data }, { status: 500 })
    }
    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
} 