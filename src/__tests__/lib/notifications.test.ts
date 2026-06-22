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

beforeEach(() => {
  jest.clearAllMocks()
})

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
    const result = await markRead(1, 'abc')
    expect(result).toBe(true)
    expect(mockZrem).toHaveBeenCalledWith('notifications:1', stored)
    expect(mockZadd).toHaveBeenCalledWith(
      'notifications:1',
      1000,
      JSON.stringify({ id: 'abc', read: true, userId: 1 })
    )
  })
})

describe('markAllRead', () => {
  it('pipelines updates for unread notifications and skips already-read ones', async () => {
    const unread = JSON.stringify({ id: 'x1', read: false, userId: 1 })
    const alreadyRead = JSON.stringify({ id: 'x2', read: true, userId: 1 })
    mockZrange.mockResolvedValueOnce([unread, '2000', alreadyRead, '1000'])
    await markAllRead(1)
    expect(mockPipeline.zrem).toHaveBeenCalledWith('notifications:1', unread)
    expect(mockPipeline.zadd).toHaveBeenCalledWith(
      'notifications:1',
      2000,
      JSON.stringify({ id: 'x1', read: true, userId: 1 })
    )
    // Should NOT process the already-read one
    expect(mockPipeline.zrem).not.toHaveBeenCalledWith('notifications:1', alreadyRead)
    expect(mockPipeline.exec).toHaveBeenCalled()
  })
})
