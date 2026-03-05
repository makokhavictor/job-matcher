import { createNotification, getNotifications, markRead, markAllRead } from '@/lib/notifications'

const mockZadd = jest.fn().mockResolvedValue(1)
const mockZremrangebyrank = jest.fn().mockResolvedValue(0)
const mockZrevrange = jest.fn().mockResolvedValue([])
const mockZrange = jest.fn().mockResolvedValue([])
const mockZrem = jest.fn().mockResolvedValue(1)
const mockPipeline = {
  zrem: jest.fn().mockReturnThis(),
  zadd: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
}

jest.mock('@/lib/queue/redis', () => ({
  getRedisConnection: () => ({
    zadd: mockZadd,
    zremrangebyrank: mockZremrangebyrank,
    zrevrange: mockZrevrange,
    zrange: mockZrange,
    zrem: mockZrem,
    pipeline: () => mockPipeline,
  }),
}))

describe('createNotification', () => {
  it('stores a notification with generated id and read=false', async () => {
    const n = await createNotification({
      userId: 1,
      type: 'match_complete',
      title: 'Match complete',
      message: 'Your analysis is ready',
      data: { analysisId: 42 },
    })
    expect(n.id).toBeDefined()
    expect(n.read).toBe(false)
    expect(mockZadd).toHaveBeenCalled()
  })
})

describe('getNotifications', () => {
  it('returns empty array when no notifications', async () => {
    mockZrevrange.mockResolvedValueOnce([])
    const result = await getNotifications(1)
    expect(result).toEqual([])
  })
})

describe('markRead', () => {
  it('flips read flag for matching notification', async () => {
    const stored = JSON.stringify({ id: 'abc', read: false, userId: 1 })
    mockZrange.mockResolvedValueOnce([stored, '1000'])
    await markRead(1, 'abc')
    expect(mockZrem).toHaveBeenCalledWith('notifications:1', stored)
    expect(mockZadd).toHaveBeenCalledWith(
      'notifications:1',
      1000,
      JSON.stringify({ id: 'abc', read: true, userId: 1 })
    )
  })
})
