import { NextRequest, NextResponse } from 'next/server'
import { markRead } from '@/lib/notifications'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const userId = parseInt(req.nextUrl.searchParams.get('user_id') ?? '0', 10)
  if (!userId) {
    return NextResponse.json({ error: 'user_id required' }, { status: 400 })
  }

  const found = await markRead(userId, id)
  if (!found) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
