import { NextRequest, NextResponse } from 'next/server'
import { cancelSubscription } from '@/lib/payments/lemonsqueezy'

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId } = await req.json()
    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 })
    }
    const result = await cancelSubscription(subscriptionId)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
} 