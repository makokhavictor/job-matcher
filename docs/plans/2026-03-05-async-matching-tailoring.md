# Async Matching & CV Tailoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor matching and CV tailoring from blocking synchronous calls into queued background jobs, with a persistent status banner, unified jobs store, and in-app notification bell.

**Architecture:** Two new BullMQ queues (`matcher-analysis`, `tailor-cv`) with dedicated workers call the Python backend. A Zustand `useJobsStore` manages SSE connections and job states centrally. A fixed bottom banner shows active jobs; a notification bell shows completed/failed job history (Redis-backed, no Python backend changes needed).

**Tech Stack:** BullMQ, IORedis, Zustand, SSE (EventSource), Next.js App Router API routes, React, Tailwind CSS, Lucide icons, Sonner toasts.

---

## Prerequisite: Understand the existing SSE pattern

Before starting, read these files to understand how the existing career-position queue flow works — this plan mirrors it exactly:
- `src/lib/queue/queues.ts` — queue definitions
- `src/lib/queue/llm-worker.ts` — worker pattern (publishStatus via Redis pub/sub)
- `src/app/api/career-position/route.ts` — API route that enqueues and returns jobId
- `src/app/api/jobs/[jobId]/status/route.ts` — SSE route (no changes needed)
- `src/hooks/useJobStatus.ts` — existing SSE client hook (reference only)

---

## Task 1: Add new queues to queues.ts

**Files:**
- Modify: `src/lib/queue/queues.ts`

**What it does:** Adds `MatcherJobData` and `TailorJobData` types and two new BullMQ queue singletons for `matcher-analysis` and `tailor-cv`.

**Step 1: Add types and queue factories**

Append to `src/lib/queue/queues.ts` after the existing `getEmailQueue` export:

```typescript
export type MatcherJobData = {
  jobId: string
  userId: number
  userEmail: string
  cvText: string
  jobText: string
}

export type TailorJobData = {
  jobId: string
  userId: number
  userEmail: string
  analysisResultId: string
  cvText: string
  jobText: string
}

let matcherQueue: Queue<MatcherJobData> | null = null
let tailorQueue: Queue<TailorJobData> | null = null

export function getMatcherQueue(): Queue<MatcherJobData> {
  if (!matcherQueue) {
    matcherQueue = new Queue<MatcherJobData>('matcher-analysis', {
      connection: getConnectionOptions(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    })
  }
  return matcherQueue!
}

export function getTailorQueue(): Queue<TailorJobData> {
  if (!tailorQueue) {
    tailorQueue = new Queue<TailorJobData>('tailor-cv', {
      connection: getConnectionOptions(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    })
  }
  return tailorQueue!
}
```

**Step 2: Write a smoke test**

Create `src/__tests__/queue/queues.test.ts`:

```typescript
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
```

**Step 3: Run test**

```bash
pnpm test --testPathPattern=queues
```

Expected: PASS

**Step 4: Commit**

```bash
git add src/lib/queue/queues.ts src/__tests__/queue/queues.test.ts
git commit -m "feat: add matcher-analysis and tailor-cv BullMQ queues"
```

---

## Task 2: Create notifications store (Redis-backed)

**Files:**
- Create: `src/lib/notifications.ts`

**What it does:** Stores and retrieves in-app notifications in Redis as a sorted set per user. No Python backend changes needed.

**Notification shape:**
```typescript
{
  id: string          // UUID
  userId: number
  type: 'match_complete' | 'tailor_complete' | 'match_failed' | 'tailor_failed'
  title: string
  message: string
  data: { analysisId?: number; matchScore?: number }
  read: boolean
  createdAt: string   // ISO timestamp
}
```

Redis key: `notifications:{userId}` — sorted set, score = timestamp ms.

**Step 1: Create the notifications module**

Create `src/lib/notifications.ts`:

```typescript
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

export async function markRead(userId: number, notificationId: string): Promise<void> {
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
      await redis.zadd(key(userId), parseInt(score), JSON.stringify(updated))
      break
    }
  }
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
      pipeline.zadd(key(userId), parseInt(score), JSON.stringify(updated))
    }
  }
  await pipeline.exec()
}
```

**Step 2: Write tests**

Create `src/__tests__/lib/notifications.test.ts`:

```typescript
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
```

**Step 3: Run tests**

```bash
pnpm test --testPathPattern=notifications
```

Expected: PASS

**Step 4: Commit**

```bash
git add src/lib/notifications.ts src/__tests__/lib/notifications.test.ts
git commit -m "feat: add Redis-backed in-app notifications store"
```

---

## Task 3: Create matcher-worker.ts

**Files:**
- Create: `src/lib/queue/matcher-worker.ts`

**What it does:** Processes `matcher-analysis` jobs — calls Python `/matcher/match`, publishes SSE steps, writes analysis result, creates a `match_complete` notification.

**Step 1: Create the worker**

Create `src/lib/queue/matcher-worker.ts`:

```typescript
import { Worker, Job } from 'bullmq'
import { getRedisConnection } from './redis'
import type { MatcherJobData } from './queues'
import { createNotification } from '@/lib/notifications'

const PYTHON_API_URL = process.env.PYTHON_API_URL ?? 'http://localhost:8000'

function getWorkerConnectionOptions() {
  const url = process.env.REDIS_URL ?? 'redis://localhost:6379'
  try {
    const parsed = new URL(url)
    return { host: parsed.hostname, port: parseInt(parsed.port || '6379', 10), maxRetriesPerRequest: null as null }
  } catch {
    return { host: 'localhost', port: 6379, maxRetriesPerRequest: null as null }
  }
}

async function publishStatus(jobId: string, event: object) {
  const redis = getRedisConnection()
  await redis.publish(`job:${jobId}:status`, JSON.stringify(event))
}

export function startMatcherWorker() {
  const worker = new Worker<MatcherJobData>(
    'matcher-analysis',
    async (job: Job<MatcherJobData>) => {
      const { jobId, userId, userEmail, cvText, jobText } = job.data

      await publishStatus(jobId, { event: 'active', data: { step: 'parsing_documents' } })

      const formData = new URLSearchParams()
      formData.set('cv_text', cvText)
      formData.set('job_text', jobText)

      await publishStatus(jobId, { event: 'active', data: { step: 'analyzing_match' } })

      const response = await fetch(`${PYTHON_API_URL}/matcher/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })

      if (!response.ok) {
        const err = await response.text()
        throw new Error(`Python API error ${response.status}: ${err}`)
      }

      await publishStatus(jobId, { event: 'active', data: { step: 'calculating_score' } })

      const data = await response.json()

      await publishStatus(jobId, {
        event: 'completed',
        data: { resultId: data.result_id, results: data.results },
      })

      await createNotification({
        userId,
        type: 'match_complete',
        title: 'Analysis complete',
        message: `Your CV match analysis is ready.`,
        data: { analysisId: data.result_id, matchScore: data.results?.match_score },
      })

      return data
    },
    { connection: getWorkerConnectionOptions(), concurrency: 3 }
  )

  worker.on('failed', async (job) => {
    if (!job) return
    const { jobId, userId } = job.data
    await publishStatus(jobId, { event: 'failed', data: { message: 'Analysis failed. Please try again.' } })
    await createNotification({
      userId,
      type: 'match_failed',
      title: 'Analysis failed',
      message: 'Something went wrong. Please try again.',
      data: {},
    })
  })

  console.log('[Matcher Worker] Started, listening on matcher-analysis queue')
  return worker
}
```

**Step 2: Verify it compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors related to matcher-worker.ts

**Step 3: Commit**

```bash
git add src/lib/queue/matcher-worker.ts
git commit -m "feat: add matcher-analysis BullMQ worker"
```

---

## Task 4: Create tailor-worker.ts

**Files:**
- Create: `src/lib/queue/tailor-worker.ts`

**Step 1: Create the worker**

Create `src/lib/queue/tailor-worker.ts`:

```typescript
import { Worker, Job } from 'bullmq'
import { getRedisConnection } from './redis'
import type { TailorJobData } from './queues'
import { createNotification } from '@/lib/notifications'

const PYTHON_API_URL = process.env.PYTHON_API_URL ?? 'http://localhost:8000'

function getWorkerConnectionOptions() {
  const url = process.env.REDIS_URL ?? 'redis://localhost:6379'
  try {
    const parsed = new URL(url)
    return { host: parsed.hostname, port: parseInt(parsed.port || '6379', 10), maxRetriesPerRequest: null as null }
  } catch {
    return { host: 'localhost', port: 6379, maxRetriesPerRequest: null as null }
  }
}

async function publishStatus(jobId: string, event: object) {
  const redis = getRedisConnection()
  await redis.publish(`job:${jobId}:status`, JSON.stringify(event))
}

export function startTailorWorker() {
  const worker = new Worker<TailorJobData>(
    'tailor-cv',
    async (job: Job<TailorJobData>) => {
      const { jobId, userId, analysisResultId, cvText, jobText } = job.data

      await publishStatus(jobId, { event: 'active', data: { step: 'tailoring_cv' } })

      const formData = new URLSearchParams()
      formData.set('cv_text', cvText)
      formData.set('job_text', jobText)
      formData.set('analysis_result_id', analysisResultId)

      const response = await fetch(`${PYTHON_API_URL}/matcher/tailor-cv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })

      if (!response.ok) {
        const err = await response.text()
        throw new Error(`Python API error ${response.status}: ${err}`)
      }

      const data = await response.json()

      await publishStatus(jobId, {
        event: 'completed',
        data: { tailoredCv: data.results?.tailored_cv },
      })

      await createNotification({
        userId,
        type: 'tailor_complete',
        title: 'Tailored CV ready',
        message: 'Your tailored CV has been generated.',
        data: { analysisId: parseInt(analysisResultId) },
      })

      return data
    },
    { connection: getWorkerConnectionOptions(), concurrency: 3 }
  )

  worker.on('failed', async (job) => {
    if (!job) return
    const { jobId, userId } = job.data
    await publishStatus(jobId, { event: 'failed', data: { message: 'CV tailoring failed. Please try again.' } })
    await createNotification({
      userId,
      type: 'tailor_failed',
      title: 'CV tailoring failed',
      message: 'Something went wrong tailoring your CV. Please try again.',
      data: {},
    })
  })

  console.log('[Tailor Worker] Started, listening on tailor-cv queue')
  return worker
}
```

**Step 2: Verify compilation**

```bash
pnpm tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/lib/queue/tailor-worker.ts
git commit -m "feat: add tailor-cv BullMQ worker"
```

---

## Task 5: Register workers in start-workers.ts

**Files:**
- Modify: `src/lib/queue/start-workers.ts`

**Step 1: Add the two new workers**

Replace the entire file content:

```typescript
import { startLLMWorker } from './llm-worker'
import { startEmailWorker } from './email-worker'
import { startMatcherWorker } from './matcher-worker'
import { startTailorWorker } from './tailor-worker'

startLLMWorker()
startEmailWorker()
startMatcherWorker()
startTailorWorker()
```

**Step 2: Verify compilation**

```bash
pnpm tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/lib/queue/start-workers.ts
git commit -m "feat: register matcher and tailor workers"
```

---

## Task 6: Create POST /api/matcher/match route

**Files:**
- Create: `src/app/api/matcher/match/route.ts`

**What it does:** Accepts CV + JD content (text or file), parses files to text inline, enqueues to `matcher-analysis`, returns `{ jobId }` immediately. The client no longer waits for the Python backend.

**Key detail:** Files (PDF/DOCX) are parsed to text in this route using the same logic as `src/app/api/parse-cv/route.ts` before being stored in the job. This keeps workers simple (text only).

**Step 1: Create the route**

Create `src/app/api/matcher/match/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getMatcherQueue } from '@/lib/queue/queues'

async function parseFileToText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  if (file.name.endsWith('.pdf')) {
    const pdfParse = (await import('pdf-parse-fork')).default
    const parsed = await pdfParse(buffer)
    return parsed.text
  }
  if (file.name.endsWith('.docx')) {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }
  return buffer.toString('utf-8')
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()

  const userId = parseInt((formData.get('user_id') as string) ?? '0', 10)
  const userEmail = (formData.get('user_email') as string) ?? ''

  // Resolve CV text
  let cvText = ''
  const cvFile = formData.get('cv_file') as File | null
  const cvTextRaw = formData.get('cv_text') as string | null
  if (cvFile) {
    cvText = await parseFileToText(cvFile)
  } else if (cvTextRaw) {
    cvText = cvTextRaw
  } else {
    return NextResponse.json({ error: 'cv_file or cv_text required' }, { status: 400 })
  }

  // Resolve JD text
  let jobText = ''
  const jobFile = formData.get('job_file') as File | null
  const jobTextRaw = formData.get('job_text') as string | null
  if (jobFile) {
    jobText = await parseFileToText(jobFile)
  } else if (jobTextRaw) {
    jobText = jobTextRaw
  } else {
    return NextResponse.json({ error: 'job_file or job_text required' }, { status: 400 })
  }

  const jobId = randomUUID()
  const queue = getMatcherQueue()

  await queue.add('match', { jobId, userId, userEmail, cvText, jobText })

  return NextResponse.json({ jobId })
}
```

**Step 2: Manual verification**

Start the dev server (`pnpm dev`) and use curl to test:

```bash
curl -X POST http://localhost:3000/api/matcher/match \
  -H "Authorization: Bearer test-token" \
  -F "cv_text=I am a software engineer with 5 years experience" \
  -F "job_text=Looking for a senior engineer" \
  -F "user_id=1" \
  -F "user_email=test@test.com"
```

Expected: `{"jobId":"<uuid>"}` returned immediately.

**Step 3: Commit**

```bash
git add src/app/api/matcher/match/route.ts
git commit -m "feat: add /api/matcher/match queue route"
```

---

## Task 7: Create POST /api/matcher/tailor-cv route

**Files:**
- Create: `src/app/api/matcher/tailor-cv/route.ts`

**Step 1: Create the route**

Create `src/app/api/matcher/tailor-cv/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getTailorQueue } from '@/lib/queue/queues'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()

  const userId = parseInt((formData.get('user_id') as string) ?? '0', 10)
  const userEmail = (formData.get('user_email') as string) ?? ''
  const analysisResultId = (formData.get('analysis_result_id') as string) ?? ''
  const cvText = (formData.get('cv_text') as string) ?? ''
  const jobText = (formData.get('job_text') as string) ?? ''

  if (!cvText || !jobText) {
    return NextResponse.json({ error: 'cv_text and job_text are required' }, { status: 400 })
  }

  const jobId = randomUUID()
  const queue = getTailorQueue()

  await queue.add('tailor', { jobId, userId, userEmail, analysisResultId, cvText, jobText })

  return NextResponse.json({ jobId })
}
```

**Step 2: Verify compilation**

```bash
pnpm tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/app/api/matcher/tailor-cv/route.ts
git commit -m "feat: add /api/matcher/tailor-cv queue route"
```

---

## Task 8: Create notifications API routes

**Files:**
- Create: `src/app/api/notifications/route.ts`
- Create: `src/app/api/notifications/[id]/read/route.ts`
- Create: `src/app/api/notifications/read-all/route.ts`

**What it does:** Proxies to the Redis notifications module. The auth token carries user identity — these routes extract `user_id` from the request header (sent by the client alongside the Bearer token).

**Note:** The client must send `user_id` as a query param since the Next.js app doesn't decode JWTs server-side. This matches the pattern in `/api/career-position/route.ts` which reads `user_id` from formData.

**Step 1: GET /api/notifications**

Create `src/app/api/notifications/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getNotifications } from '@/lib/notifications'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = parseInt(req.nextUrl.searchParams.get('user_id') ?? '0', 10)
  if (!userId) {
    return NextResponse.json({ error: 'user_id required' }, { status: 400 })
  }

  const notifications = await getNotifications(userId)
  return NextResponse.json(notifications)
}
```

**Step 2: PATCH /api/notifications/[id]/read**

Create `src/app/api/notifications/[id]/read/route.ts`:

```typescript
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

  await markRead(userId, id)
  return NextResponse.json({ ok: true })
}
```

**Step 3: PATCH /api/notifications/read-all**

Create `src/app/api/notifications/read-all/route.ts`:

```typescript
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
```

**Step 4: Commit**

```bash
git add src/app/api/notifications/
git commit -m "feat: add notifications API routes (GET, mark-read, mark-all-read)"
```

---

## Task 9: Create useJobsStore

**Files:**
- Create: `src/stores/jobs.store.ts`

**What it does:** Central Zustand store that tracks all active/pending/completed jobs. Each job opens one SSE connection. On SSE `completed`, it stores result data in the job entry so components can read it. On `completed` or `failed`, closes the SSE and refreshes notifications.

**Step 1: Create the store**

Create `src/stores/jobs.store.ts`:

```typescript
import { create } from 'zustand'

export type JobType = 'matching' | 'tailoring'
export type JobStatus = 'pending' | 'active' | 'completed' | 'failed'

export interface JobEntry {
  jobId: string
  type: JobType
  status: JobStatus
  step?: string
  // For matching jobs: result data on completion
  resultId?: number
  results?: Record<string, unknown>
  // For tailoring jobs: tailored CV on completion
  tailoredCv?: Record<string, unknown>
  error?: string
}

interface JobsStore {
  jobs: Map<string, JobEntry>
  addJob: (jobId: string, type: JobType) => void
  removeJob: (jobId: string) => void
  // Internal: update job from SSE events
  _updateJob: (jobId: string, patch: Partial<JobEntry>) => void
  // Derived
  activePendingJobs: () => JobEntry[]
  getJob: (jobId: string) => JobEntry | undefined
  // SSE cleanup registry
  _eventSources: Map<string, EventSource>
  // Callback fired when a job completes or fails (for notification refresh)
  onJobSettled?: () => void
  setOnJobSettled: (cb: () => void) => void
}

export const useJobsStore = create<JobsStore>((set, get) => ({
  jobs: new Map(),
  _eventSources: new Map(),
  onJobSettled: undefined,

  setOnJobSettled: (cb) => set({ onJobSettled: cb }),

  addJob: (jobId, type) => {
    set((state) => {
      const next = new Map(state.jobs)
      next.set(jobId, { jobId, type, status: 'pending' })
      return { jobs: next }
    })

    // Open SSE connection
    const es = new EventSource(`/api/jobs/${jobId}/status`)

    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data)
        const { event, data } = parsed

        if (event === 'queued') {
          get()._updateJob(jobId, { status: 'pending' })
        } else if (event === 'active') {
          get()._updateJob(jobId, { status: 'active', step: data?.step })
        } else if (event === 'completed') {
          get()._updateJob(jobId, {
            status: 'completed',
            resultId: data?.resultId,
            results: data?.results,
            tailoredCv: data?.tailoredCv,
          })
          es.close()
          get()._eventSources.delete(jobId)
          get().onJobSettled?.()
        } else if (event === 'failed') {
          get()._updateJob(jobId, { status: 'failed', error: data?.message })
          es.close()
          get()._eventSources.delete(jobId)
          get().onJobSettled?.()
        } else if (event === 'timeout') {
          get()._updateJob(jobId, { status: 'failed', error: 'Timed out. We will notify you when ready.' })
          es.close()
          get()._eventSources.delete(jobId)
          get().onJobSettled?.()
        }
      } catch {
        // ignore parse errors
      }
    }

    es.onerror = () => {
      get()._updateJob(jobId, { status: 'failed', error: 'Connection lost.' })
      es.close()
      get()._eventSources.delete(jobId)
      get().onJobSettled?.()
    }

    set((state) => {
      const next = new Map(state._eventSources)
      next.set(jobId, es)
      return { _eventSources: next }
    })
  },

  removeJob: (jobId) => {
    const es = get()._eventSources.get(jobId)
    es?.close()
    set((state) => {
      const jobs = new Map(state.jobs)
      const sources = new Map(state._eventSources)
      jobs.delete(jobId)
      sources.delete(jobId)
      return { jobs, _eventSources: sources }
    })
  },

  _updateJob: (jobId, patch) => {
    set((state) => {
      const next = new Map(state.jobs)
      const existing = next.get(jobId)
      if (existing) next.set(jobId, { ...existing, ...patch })
      return { jobs: next }
    })
  },

  activePendingJobs: () => {
    return Array.from(get().jobs.values()).filter(
      (j) => j.status === 'pending' || j.status === 'active'
    )
  },

  getJob: (jobId) => get().jobs.get(jobId),
}))
```

**Step 2: Commit**

```bash
git add src/stores/jobs.store.ts
git commit -m "feat: add useJobsStore for centralized job tracking with SSE"
```

---

## Task 10: Refactor useMatcher

**Files:**
- Modify: `src/hooks/useMatcher.ts`

**What it does:** Instead of calling the Python backend directly and blocking, it now calls `/api/matcher/match`, gets a `jobId`, registers it in `useJobsStore`, and advances the stepper immediately. The `useAnalysisStore` gets updated when the job completes (via a `useEffect` in the component — see Task 11).

**Step 1: Rewrite useMatcher**

Replace the entire content of `src/hooks/useMatcher.ts`:

```typescript
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useAnalysisStore } from '@/stores/analysis.store'
import { useJobsStore } from '@/stores/jobs.store'
import { useAuth } from '@/app/providers/auth-provider'

interface UploadState {
  cv: File | string | null
  jobDescription: File | string | null
  metadata: {
    cv?: { type: 'text' | 'url' | 'file' }
    jobDescription?: { type: 'text' | 'url' | 'file' }
  }
}

export function useMatcher() {
  const [uploadState, setUploadState] = useState<UploadState>({
    cv: null,
    jobDescription: null,
    metadata: {},
  })

  const [matchingJobId, setMatchingJobId] = useState<string | null>(null)

  const resetAnalysisStore = useAnalysisStore((state) => state.reset)
  const setOriginals = useAnalysisStore((state) => state.setOriginals)
  const addJob = useJobsStore((state) => state.addJob)
  const { user } = useAuth()

  const handleFileUpload = async (
    type: 'cv' | 'jobDescription',
    fileOrText: File | string,
    onSuccess: () => void,
    metadata?: { type: 'text' | 'url' | 'file' },
  ) => {
    try {
      if (typeof fileOrText === 'string' && fileOrText.trim() === '') {
        throw new Error('Input is empty.')
      }

      if (fileOrText instanceof File) {
        if (fileOrText.size > 10 * 1024 * 1024) throw new Error('File size exceeds 10MB limit')
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ]
        if (!allowedTypes.includes(fileOrText.type)) {
          throw new Error('Invalid file type. Please upload PDF, DOCX, or TXT files only.')
        }
      }

      const newState = {
        ...uploadState,
        [type]: fileOrText,
        metadata: {
          ...uploadState.metadata,
          [type]: metadata ?? { type: typeof fileOrText === 'string' ? 'text' : 'file' },
        },
      }
      setUploadState(newState)

      const cv = type === 'cv' ? fileOrText : uploadState.cv
      const jobDescription = type === 'jobDescription' ? fileOrText : uploadState.jobDescription

      if (cv && jobDescription) {
        setOriginals(cv, jobDescription)

        const auth = localStorage.getItem('auth')
        const token = auth ? JSON.parse(auth).access_token : null

        const formData = new FormData()
        formData.append('user_id', String(user?.id ?? '0'))
        formData.append('user_email', user?.email ?? '')

        if (cv instanceof File) {
          formData.append('cv_file', cv, cv.name)
        } else {
          formData.append('cv_text', cv)
        }

        if (jobDescription instanceof File) {
          formData.append('job_file', jobDescription, jobDescription.name)
        } else {
          formData.append('job_text', jobDescription)
        }

        const response = await fetch('/api/matcher/match', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })

        if (!response.ok) throw new Error('Failed to queue analysis')

        const { jobId } = await response.json()
        setMatchingJobId(jobId)
        addJob(jobId, 'matching')
        toast('Analysis queued — we\'ll notify you when it\'s ready.')
      }

      onSuccess()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error processing input'
      toast.error(message)
    }
  }

  const resetAnalysis = () => {
    setUploadState({ cv: null, jobDescription: null, metadata: {} })
    setMatchingJobId(null)
    resetAnalysisStore()
    toast('All documents cleared')
  }

  return { handleFileUpload, resetAnalysis, matchingJobId }
}
```

**Step 2: Commit**

```bash
git add src/hooks/useMatcher.ts
git commit -m "refactor: useMatcher now queues matching job instead of blocking"
```

---

## Task 11: Refactor useTailorCv

**Files:**
- Modify: `src/hooks/useTailorCv.ts`

**Step 1: Rewrite useTailorCv**

Replace the entire content of `src/hooks/useTailorCv.ts`:

```typescript
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useAnalysisStore } from '@/stores/analysis.store'
import { useJobsStore } from '@/stores/jobs.store'
import { useAuth } from '@/app/providers/auth-provider'

export function useTailorCv() {
  const [tailoringJobId, setTailoringJobId] = useState<string | null>(null)

  const { originalCv, originalJd, results, currentAnalysis } = useAnalysisStore()
  const addJob = useJobsStore((state) => state.addJob)
  const { user } = useAuth()

  const tailorCv = async (cvContent?: string, jdContent?: string) => {
    const cvToUse = cvContent ?? (typeof originalCv === 'string' ? originalCv : null)
    const jdToUse = jdContent ?? (typeof originalJd === 'string' ? originalJd : null)

    if (!cvToUse || !jdToUse) {
      toast.error('No analysis results available to tailor from.')
      return
    }

    const auth = localStorage.getItem('auth')
    const token = auth ? JSON.parse(auth).access_token : null

    const formData = new FormData()
    formData.append('user_id', String(user?.id ?? '0'))
    formData.append('user_email', user?.email ?? '')
    formData.append('cv_text', cvToUse)
    formData.append('job_text', jdToUse)
    formData.append(
      'analysis_result_id',
      results?.id?.toString() ?? currentAnalysis?.id?.toString() ?? ''
    )

    try {
      const response = await fetch('/api/matcher/tailor-cv', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to queue CV tailoring')

      const { jobId } = await response.json()
      setTailoringJobId(jobId)
      addJob(jobId, 'tailoring')
      toast('CV tailoring queued — we\'ll notify you when it\'s ready.')
    } catch {
      toast.error('Failed to queue CV tailoring. Please try again.')
    }
  }

  return { tailorCv, tailoringJobId }
}
```

**Step 2: Commit**

```bash
git add src/hooks/useTailorCv.ts
git commit -m "refactor: useTailorCv now queues tailoring job instead of blocking"
```

---

## Task 12: Update MatcherClient — async step 3 with live progress

**Files:**
- Modify: `src/app/(app)/dashboard/matching/MatcherClient.tsx`

**What it does:** Step 3 now subscribes to the matching job in `useJobsStore`. While the job is active it shows animated progress steps. When the job completes it calls `useAnalysisStore.setResults()` and renders `<AnalysisResults />`. Uses the `frontend-design` skill for the progress UI.

**Step 1: Invoke frontend-design skill**

Before writing the component, invoke: `frontend-design` skill to guide the visual design of the progress state (animated steps, status indicators).

**Step 2: Rewrite MatcherClient**

Replace the entire content of `src/app/(app)/dashboard/matching/MatcherClient.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { FileUpload } from '@/components/upload/FileUpload'
import { AnalysisResults } from '@/components/analysis/AnalysisResults'
import { Card } from '@/components/ui/card'
import { setupDOMPolyfills } from '@/lib/domPolyfills'
import { defineStepper } from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'
import { useMatcher } from '@/hooks/useMatcher'
import { useIsMobile } from '@/hooks/use-mobile'
import { useJobsStore } from '@/stores/jobs.store'
import { useAnalysisStore } from '@/stores/analysis.store'
import { MatchingProgress } from '@/components/matching/MatchingProgress'

setupDOMPolyfills()

const stepperSteps = [
  { id: 'cv', title: 'Resume/CV', description: 'Upload your resume/cv' },
  { id: 'jd', title: 'Job Description', description: 'Upload or paste the job description' },
  { id: 'results', title: 'Results', description: 'Analysis results' },
] as const

const stepperInstance = defineStepper(...stepperSteps)
const { Stepper } = stepperInstance

export function MatcherClient() {
  const { handleFileUpload, resetAnalysis, matchingJobId } = useMatcher()
  const isMobile = useIsMobile()
  const getJob = useJobsStore((state) => state.getJob)
  const setResults = useAnalysisStore((state) => state.setResults)
  const fetchRecentAnalyses = useAnalysisStore((state) => state.fetchRecentAnalyses)

  const matchingJob = matchingJobId ? getJob(matchingJobId) : null

  // When matching job completes, populate analysis store
  useEffect(() => {
    if (matchingJob?.status === 'completed' && matchingJob.results) {
      const results = matchingJob.results as Record<string, unknown>
      let parsed = null
      try {
        parsed = typeof results === 'string' ? JSON.parse(results as string) : results
      } catch {
        parsed = null
      }
      if (parsed && typeof parsed.match_score === 'number') {
        setResults({ ...parsed, id: matchingJob.resultId } as Parameters<typeof setResults>[0])
        fetchRecentAnalyses()
      }
    }
  }, [matchingJob?.status, matchingJob?.results, matchingJob?.resultId, setResults, fetchRecentAnalyses])

  return (
    <Stepper.Provider
      className="space-y-4"
      variant={isMobile ? 'vertical' : 'horizontal'}
    >
      {({ methods }) => (
        <>
          <Stepper.Navigation>
            {methods.all.map((step) => (
              <Stepper.Step key={step.id} of={step.id} onClick={() => methods.goTo(step.id)}>
                <Stepper.Title>{step.title}</Stepper.Title>
                <Stepper.Description>{step.description}</Stepper.Description>
              </Stepper.Step>
            ))}
          </Stepper.Navigation>

          {methods.switch({
            cv: () => (
              <Card className="p-6">
                <FileUpload
                  type="cv"
                  onUploadComplete={(file, metadata) =>
                    handleFileUpload('cv', file, () => methods.next(), metadata)
                  }
                />
              </Card>
            ),
            jd: () => (
              <Card className="p-6">
                <FileUpload
                  type="jobDescription"
                  onUploadComplete={(file, metadata) =>
                    handleFileUpload('jobDescription', file, () => methods.next(), metadata)
                  }
                />
              </Card>
            ),
            results: () => (
              <section className="space-y-6">
                {matchingJob && (matchingJob.status === 'pending' || matchingJob.status === 'active') ? (
                  <MatchingProgress job={matchingJob} />
                ) : matchingJob?.status === 'failed' ? (
                  <Card className="p-6 border-red-200 bg-red-50">
                    <p className="text-red-700 font-medium">Analysis failed</p>
                    <p className="text-red-600 mt-1">{matchingJob.error ?? 'Please try again.'}</p>
                  </Card>
                ) : (
                  <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-4">
                    <AnalysisResults />
                  </div>
                )}
              </section>
            ),
          })}

          <Stepper.Controls>
            {!methods.isLast && (
              <Button variant="secondary" onClick={methods.prev} disabled={methods.isFirst}>
                Previous
              </Button>
            )}
            <Button
              onClick={
                methods.isLast
                  ? () => { methods.reset(); resetAnalysis() }
                  : methods.next
              }
            >
              {methods.isLast ? 'Reset' : 'Next'}
            </Button>
          </Stepper.Controls>
        </>
      )}
    </Stepper.Provider>
  )
}
```

**Step 3: Create MatchingProgress component**

Using the `frontend-design` skill, create `src/components/matching/MatchingProgress.tsx` — an animated multi-step progress indicator with three steps: "Parsing documents", "Analyzing match", "Calculating score". The active step pulses; completed steps show a checkmark. Style should match the Warm Modernist Editorial aesthetic used in the rest of the app.

```typescript
'use client'

import { Card } from '@/components/ui/card'
import type { JobEntry } from '@/stores/jobs.store'

const STEPS = [
  { key: 'parsing_documents', label: 'Parsing documents' },
  { key: 'analyzing_match', label: 'Analyzing match' },
  { key: 'calculating_score', label: 'Calculating score' },
]

function getStepIndex(step?: string) {
  return STEPS.findIndex((s) => s.key === step)
}

export function MatchingProgress({ job }: { job: JobEntry }) {
  const activeIndex = job.step ? getStepIndex(job.step) : -1

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Analyzing your match</h2>
          <p className="text-gray-500 text-sm">This usually takes 30–60 seconds. You can navigate away — we'll notify you when done.</p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          {STEPS.map((step, i) => {
            const isDone = activeIndex > i
            const isActive = activeIndex === i
            const isPending = activeIndex < i

            return (
              <div key={step.key} className="flex items-center gap-3">
                <div className={[
                  'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                  isDone ? 'bg-emerald-500' : isActive ? 'bg-blue-500 animate-pulse' : 'bg-gray-200',
                ].join(' ')}>
                  {isDone ? (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-400'}`} />
                  )}
                </div>
                <span className={[
                  'text-sm font-medium transition-colors',
                  isDone ? 'text-emerald-700' : isActive ? 'text-blue-700' : 'text-gray-400',
                ].join(' ')}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
```

**Step 4: Commit**

```bash
git add src/app/(app)/dashboard/matching/MatcherClient.tsx src/components/matching/MatchingProgress.tsx
git commit -m "feat: update MatcherClient with async progress UI for queued matching"
```

---

## Task 13: Update AnalysisResults — async tailored CV tab

**Files:**
- Modify: `src/components/analysis/AnalysisResults.tsx`

**What it does:** The tailored CV tab now reads from `useJobsStore` for the tailoring job state instead of `useTailorCv`'s blocking state. When tailoring job completes, the tailored CV auto-fills from job data.

**Step 1: Update the tailored CV tab section**

In `src/components/analysis/AnalysisResults.tsx`:

1. Replace the `useTailorCv` import and hook call:

```typescript
// Remove: import { useTailorCv } from '@/hooks/useTailorCv';
// Add:
import { useTailorCv } from '@/hooks/useTailorCv'
import { useJobsStore } from '@/stores/jobs.store'
```

2. Inside `AnalysisResults`, replace the tailored CV section. The hook now returns `tailoringJobId` instead of loading/error/tailoredCv state:

```typescript
const { tailorCv, tailoringJobId } = useTailorCv()
const getJob = useJobsStore((state) => state.getJob)
const tailoringJob = tailoringJobId ? getJob(tailoringJobId) : null

const tailoringLoading = tailoringJob?.status === 'pending' || tailoringJob?.status === 'active'
const tailoringError = tailoringJob?.status === 'failed' ? (tailoringJob.error ?? 'Failed to tailor CV') : null
const freshTailoredCv = tailoringJob?.status === 'completed' ? tailoringJob.tailoredCv : null
```

3. Update the tab content to use `freshTailoredCv` instead of `tailoredCv?.results?.tailored_cv`:

```typescript
{/* Show newly generated tailored CV if available */}
{!existingTailoredCv && freshTailoredCv && (
  <CvTemplate tailored_cv={freshTailoredCv as Parameters<typeof CvTemplate>[0]['tailored_cv']} />
)}

{/* Show generate button if no tailored CV exists yet and not loading */}
{!existingTailoredCv && !freshTailoredCv && !tailoringLoading && (
  // ... existing button unchanged
)}
```

**Step 2: Commit**

```bash
git add src/components/analysis/AnalysisResults.tsx
git commit -m "feat: update AnalysisResults tailored CV tab to use async job state"
```

---

## Task 14: Create JobsStatusBanner

**Files:**
- Create: `src/components/dashboard/JobsStatusBanner.tsx`
- Modify: `src/app/(app)/dashboard/layout.tsx`

**What it does:** Fixed bottom strip visible only when there are active/pending jobs. Shows each job as a pill with spinner and label. Uses Framer Motion for slide-in/out (already in dependencies).

**Step 1: Invoke frontend-design skill**

Before writing this component, invoke the `frontend-design` skill to guide the visual treatment of the banner (pill styles, spinner, animation, dark/light mode).

**Step 2: Create the component**

Create `src/components/dashboard/JobsStatusBanner.tsx`:

```typescript
'use client'

import { useJobsStore } from '@/stores/jobs.store'
import { Spinner } from '@/components/ui/spinner'
import { AnimatePresence, motion } from 'framer-motion'

const JOB_LABELS: Record<string, string> = {
  matching: 'Analyzing match…',
  tailoring: 'Tailoring CV…',
}

const STEP_LABELS: Record<string, string> = {
  parsing_documents: 'Parsing documents',
  analyzing_match: 'Analyzing match',
  calculating_score: 'Calculating score',
  tailoring_cv: 'Tailoring CV',
}

export function JobsStatusBanner() {
  const jobs = useJobsStore((state) => state.jobs)
  const active = Array.from(jobs.values()).filter(
    (j) => j.status === 'pending' || j.status === 'active'
  )

  return (
    <AnimatePresence>
      {active.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 pointer-events-none"
        >
          <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-full shadow-lg pointer-events-auto">
            {active.map((job) => (
              <div key={job.jobId} className="flex items-center gap-2 text-sm">
                <Spinner className="w-4 h-4 text-blue-400" />
                <span>
                  {job.step ? STEP_LABELS[job.step] : JOB_LABELS[job.type]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

**Step 3: Add banner to dashboard layout**

In `src/app/(app)/dashboard/layout.tsx`, import and render `JobsStatusBanner` inside the layout:

```typescript
import { JobsStatusBanner } from '@/components/dashboard/JobsStatusBanner'

// Inside the JSX, after </SidebarProvider> closing or before it:
// Add <JobsStatusBanner /> as last child inside the outer div
```

Full updated layout:

```typescript
'use client'

import { SideNav } from '@/components/layout/side-nav'
import { DashboardNav } from '@/components/layout/dashboard-nav'
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar'
import { JobsStatusBanner } from '@/components/dashboard/JobsStatusBanner'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar className="hidden lg:flex">
          <SideNav className="h-full" />
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <div className="border-b">
            <DashboardNav />
          </div>
          <main className="container py-6 space-y-6 px-6">
            {children}
          </main>
        </div>
      </div>
      <JobsStatusBanner />
    </SidebarProvider>
  )
}
```

**Step 4: Commit**

```bash
git add src/components/dashboard/JobsStatusBanner.tsx src/app/(app)/dashboard/layout.tsx
git commit -m "feat: add persistent JobsStatusBanner for active background jobs"
```

---

## Task 15: Create useNotifications hook + NotificationBell component

**Files:**
- Create: `src/hooks/useNotifications.ts`
- Create: `src/components/dashboard/NotificationBell.tsx`
- Modify: `src/components/layout/dashboard-nav.tsx`

**Step 1: Create useNotifications hook**

Create `src/hooks/useNotifications.ts`:

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/app/providers/auth-provider'
import type { AppNotification } from '@/lib/notifications'
import { useJobsStore } from '@/stores/jobs.store'

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const setOnJobSettled = useJobsStore((state) => state.setOnJobSettled)

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return
    const auth = localStorage.getItem('auth')
    const token = auth ? JSON.parse(auth).access_token : null
    setLoading(true)
    try {
      const res = await fetch(`/api/notifications?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      }
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Refresh notifications when any job settles
  useEffect(() => {
    setOnJobSettled(fetchNotifications)
  }, [setOnJobSettled, fetchNotifications])

  // Initial load
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const markRead = async (id: string) => {
    if (!user?.id) return
    const auth = localStorage.getItem('auth')
    const token = auth ? JSON.parse(auth).access_token : null
    await fetch(`/api/notifications/${id}/read?user_id=${user.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllRead = async () => {
    if (!user?.id) return
    const auth = localStorage.getItem('auth')
    const token = auth ? JSON.parse(auth).access_token : null
    await fetch(`/api/notifications/read-all?user_id=${user.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return { notifications, loading, unreadCount, markRead, markAllRead, refresh: fetchNotifications }
}
```

**Step 2: Create NotificationBell component**

Invoke the `frontend-design` skill before writing this component for visual guidance on the dropdown panel, unread badge, notification item styling, and empty state.

Create `src/components/dashboard/NotificationBell.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

const TYPE_ICONS: Record<string, string> = {
  match_complete: '✓',
  tailor_complete: '✓',
  match_failed: '✗',
  tailor_failed: '✗',
}

const TYPE_COLORS: Record<string, string> = {
  match_complete: 'text-emerald-600',
  tailor_complete: 'text-emerald-600',
  match_failed: 'text-red-600',
  tailor_failed: 'text-red-600',
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  const router = useRouter()

  const handleNotificationClick = async (n: (typeof notifications)[number]) => {
    await markRead(n.id)
    if (n.data?.analysisId) {
      router.push(`/dashboard/analyses`)
    }
    setOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Panel */}
          <div className="absolute right-0 top-10 z-50 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">Notifications</span>
              {unreadCount > 0 && (
                <button
                  className="text-xs text-blue-600 hover:underline"
                  onClick={markAllRead}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">No notifications yet</div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    className={[
                      'w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-start gap-3',
                      !n.read ? 'bg-blue-50/40 dark:bg-blue-900/10' : '',
                    ].join(' ')}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <span className={`text-lg leading-none mt-0.5 ${TYPE_COLORS[n.type] ?? 'text-gray-400'}`}>
                      {TYPE_ICONS[n.type] ?? '•'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
```

**Step 3: Add NotificationBell to DashboardNav**

In `src/components/layout/dashboard-nav.tsx`, add the bell to the nav bar:

```typescript
'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SideNav } from './side-nav'
import { NotificationBell } from '@/components/dashboard/NotificationBell'

export function DashboardNav() {
  return (
    <div className="flex items-center justify-between px-4 h-14">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SideNav />
        </SheetContent>
      </Sheet>

      <div className="ml-auto">
        <NotificationBell />
      </div>
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add src/hooks/useNotifications.ts src/components/dashboard/NotificationBell.tsx src/components/layout/dashboard-nav.tsx
git commit -m "feat: add NotificationBell with unread count and in-app notifications"
```

---

## Task 16: End-to-end smoke test

**Manual verification checklist:**

1. Start workers: `pnpm workers`
2. Start dev server: `pnpm dev`
3. Log in and go to `/dashboard/matching`
4. Upload a CV and paste a job description — confirm stepper advances to step 3 immediately
5. Confirm `MatchingProgress` shows animated steps while the job processes
6. Confirm the `JobsStatusBanner` slides up from the bottom showing "Analyzing match…"
7. When analysis completes:
   - Results auto-render in step 3 without any button click
   - Banner disappears
   - Bell icon shows a red badge with count `1`
8. Click the bell — confirm notification appears with title "Analysis complete"
9. Click the notification — confirm it marks as read (badge decrements), navigates to analyses
10. Go to an existing analysis, click "Tailor CV" tab then the "Tailor CV" button
11. Confirm toast "CV tailoring queued" appears immediately
12. Confirm banner shows "Tailoring CV…" pill
13. When complete — tailored CV tab auto-fills, banner clears, bell shows new notification

**Run type check:**

```bash
pnpm tsc --noEmit
```

Expected: no errors

**Run linter:**

```bash
pnpm lint
```

Expected: no new errors

---

## Task 17: Final cleanup commit

```bash
git add -A
git commit -m "chore: async matching & tailoring refactor — cleanup and final checks"
```
