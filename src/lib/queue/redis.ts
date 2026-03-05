import IORedis from 'ioredis'

// Singleton — reused across queue and worker instances.
let connection: IORedis | null = null

export function getRedisConnection(): IORedis {
  if (!connection) {
    connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: null, // Required by BullMQ
    })
  }
  return connection
}
