import { NextRequest } from 'next/server'
import { getRedisConnection } from '@/lib/queue/redis'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params
  const channel = `job:${jobId}:status`

  const encoder = new TextEncoder()
  const subscriber = getRedisConnection().duplicate()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
      }

      send(JSON.stringify({ event: 'queued', data: { position: 1, eta: '~40s' } }))

      subscriber.subscribe(channel, (err) => {
        if (err) controller.close()
      })

      subscriber.on('message', (_ch: string, message: string) => {
        send(message)
        try {
          const parsed = JSON.parse(message)
          if (parsed.event === 'completed' || parsed.event === 'failed') {
            subscriber.unsubscribe(channel)
            subscriber.quit()
            controller.close()
          }
        } catch {
          // ignore parse errors
        }
      })

      // Timeout after 3 minutes
      setTimeout(() => {
        send(JSON.stringify({ event: 'timeout', data: { message: "This is taking longer than usual. We'll email you when it's ready." } }))
        subscriber.unsubscribe(channel)
        subscriber.quit()
        controller.close()
      }, 3 * 60 * 1000)
    },
    cancel() {
      subscriber.unsubscribe(channel)
      subscriber.quit()
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
