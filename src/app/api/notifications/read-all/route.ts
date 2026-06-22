import { NextRequest, NextResponse } from 'next/server'
import { markAllRead } from '@/lib/notifications'

export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = parseInt(req.nextUrl.searchParams.get('user_id') ?? '0', 10)
  if (!userId) {
    return NextResponse.json({ error: 'user_id required' }, { status: 400 })
  }

  await markAllRead(userId)
  return NextResponse.json({ ok: true })
}
