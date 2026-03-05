import { NextRequest, NextResponse } from 'next/server'

/**
 * Called by a cron scheduler (e.g. Vercel Cron, GitHub Actions) every Monday 09:00.
 * Fetches all active users with career position results and enqueues weekly-digest emails.
 *
 * Protect with CRON_SECRET header.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // TODO: In a full implementation, query the DB for all users with results
  // and enqueue a weekly-digest job per user. For MVP, this is a stub
  // that can be expanded once user lookup is wired to the Python API.
  // TODO: In a full implementation, query the DB for all users with results
  // and enqueue a weekly-digest job per user using getEmailQueue().
  // Example:
  // const emailQueue = getEmailQueue()
  // await emailQueue.add('weekly-digest', {
  //   type: 'weekly-digest',
  //   userId: 1,
  //   email: 'user@example.com',
  //   score: 67,
  //   previousScore: 52,
  // })

  return NextResponse.json({ ok: true, message: 'Weekly digest cron triggered' })
}
