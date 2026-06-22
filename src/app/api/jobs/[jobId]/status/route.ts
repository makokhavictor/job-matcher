import { NextRequest } from 'next/server'
import { getRedisConnection } from '@/lib/queue/redis'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params
  const channel = `job:${jobId}:status`

  const encoder = new TextEncoder()
  const subscriber = getRedisConnection().duplicate()

  let closed = false
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const cleanup = () => {
    if (timeoutId) clearTimeout(timeoutId)
    subscriber.unsubscribe(channel)
    subscriber.quit()
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: string) => {
        if (closed) return
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
      }

      const close = () => {
        if (closed) return
        closed = true
        cleanup()
        controller.close()
      }

      send(JSON.stringify({ event: 'queued', data: { position: 1, eta: '~40s' } }))

      subscriber.subscribe(channel, (err) => {
        if (err) close()
      })

      subscriber.on('message', (_ch: string, message: string) => {
        send(message)
        try {
          const parsed = JSON.parse(message)
          if (parsed.event === 'completed' || parsed.event === 'failed') {
            close()
          }
        } catch {
          // ignore parse errors
        }
      })

      // Timeout after 3 minutes
      timeoutId = setTimeout(() => {
        send(JSON.stringify({ event: 'timeout', data: { message: "This is taking longer than usual. We'll email you when it's ready." } }))
        close()
      }, 3 * 60 * 1000)
    },
    cancel() {
      closed = true
      cleanup()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
