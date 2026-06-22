import { getMatcherQueue, getTailorQueue } from '@/lib/queue/queues'

jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation((name) => ({ name })),
}))

describe('getMatcherQueue', () => {
  it('returns a singleton queue named matcher-analysis', () => {
    const q1 = getMatcherQueue()
    const q2 = getMatcherQueue()
    expect(q1).toBe(q2)
    expect(q1.name).toBe('matcher-analysis')
  })
})

describe('getTailorQueue', () => {
  it('returns a singleton queue named tailor-cv', () => {
    const q1 = getTailorQueue()
    const q2 = getTailorQueue()
    expect(q1).toBe(q2)
    expect(q1.name).toBe('tailor-cv')
  })
})
