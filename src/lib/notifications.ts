import { getRedisConnection } from '@/lib/queue/redis'

export type NotificationType =
  | 'match_complete'
  | 'tailor_complete'
  | 'match_failed'
  | 'tailor_failed'

export interface AppNotification {
  id: string
  userId: number
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown>
  read: boolean
  createdAt: string
}

function key(userId: number) {
  return `notifications:${userId}`
}

export async function createNotification(
  n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>
): Promise<AppNotification> {
  const redis = getRedisConnection()
  const notification: AppNotification = {
    ...n,
    id: crypto.randomUUID(),
    read: false,
    createdAt: new Date().toISOString(),
  }
  const score = Date.now()
  await redis.zadd(key(n.userId), score, JSON.stringify(notification))
  // Keep only the 50 most recent notifications per user
  await redis.zremrangebyrank(key(n.userId), 0, -51)
  return notification
}

export async function getNotifications(userId: number): Promise<AppNotification[]> {
  const redis = getRedisConnection()
  const raw = await redis.zrevrange(key(userId), 0, 49)
  return raw.map((r) => JSON.parse(r) as AppNotification)
}

export async function markRead(userId: number, notificationId: string): Promise<boolean> {
  const redis = getRedisConnection()
  const raw = await redis.zrange(key(userId), 0, -1, 'WITHSCORES')
  // raw = [member, score, member, score, ...]
  for (let i = 0; i < raw.length; i += 2) {
    const member = raw[i]
    const score = raw[i + 1]
    const n = JSON.parse(member) as AppNotification
    if (n.id === notificationId) {
      const updated = { ...n, read: true }
      await redis.zrem(key(userId), member)
      await redis.zadd(key(userId), parseInt(score, 10), JSON.stringify(updated))
      return true
    }
  }
  return false
}

export async function markAllRead(userId: number): Promise<void> {
  const redis = getRedisConnection()
  const raw = await redis.zrange(key(userId), 0, -1, 'WITHSCORES')
  const pipeline = redis.pipeline()
  for (let i = 0; i < raw.length; i += 2) {
    const member = raw[i]
    const score = raw[i + 1]
    const n = JSON.parse(member) as AppNotification
    if (!n.read) {
      const updated = { ...n, read: true }
      pipeline.zrem(key(userId), member)
      pipeline.zadd(key(userId), parseInt(score, 10), JSON.stringify(updated))
    }
  }
  await pipeline.exec()
}
