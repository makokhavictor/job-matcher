# Async Matching & CV Tailoring — Design

**Date:** 2026-03-05
**Branch:** develop

## Overview

Refactor the CV matching and tailoring flows from synchronous blocking calls into queued background jobs. Introduce a unified jobs store, a persistent status banner, and an in-app notification system with read/unread state — replacing email notifications for these job types.

---

## Architecture

### Flow Summary

```
User uploads CV + JD
  → POST /api/matcher/match  →  enqueue job  →  return { jobId }
  → useJobsStore.addJob(jobId, 'matching')
  → SSE: /api/jobs/[jobId]/status  →  updates store
  → Stepper step 3 shows live progress  →  auto-reveals results on complete
  → Job leaves banner  →  notification lands in bell

User clicks "Tailor CV"
  → POST /api/matcher/tailor-cv  →  enqueue job  →  return { jobId }
  → useJobsStore.addJob(jobId, 'tailoring')
  → Tailored CV tab shows inline pending state  →  auto-fills on complete
```

---

## Backend

### New BullMQ Queues (queues.ts)

**`matcher-analysis` queue**
- Job data: `{ jobId, userId, userEmail, cvText?, cvUrl?, jobText?, jobUrl? }`
- Steps published via SSE: `parsing_documents → analyzing_match → calculating_score`
- On complete: stores result, writes `match_complete` notification
- On fail: writes `match_failed` notification

**`tailor-cv` queue**
- Job data: `{ jobId, userId, userEmail, analysisResultId, cvText?, jobText? }`
- Steps published via SSE: `tailoring_cv`
- On complete: updates analysis record with tailored CV, writes `tailor_complete` notification
- On fail: writes `tailor_failed` notification

### New Workers

- `matcher-worker.ts` — processes `matcher-analysis` queue, calls Python `/matcher/match`
- `tailor-worker.ts` — processes `tailor-cv` queue, calls Python `/matcher/tailor-cv`
- Both follow the same pattern as `llm-worker.ts` (Redis pub/sub for SSE, email queue replaced by notification writes)

### New API Routes

- `POST /api/matcher/match` — validates input, enqueues job, returns `{ jobId }` immediately
- `POST /api/matcher/tailor-cv` — enqueues job, returns `{ jobId }` immediately
- `GET /api/notifications` — fetch user notifications sorted by newest
- `PATCH /api/notifications/[id]/read` — mark single notification as read
- `PATCH /api/notifications/read-all` — mark all as read

### Existing (no changes)

- `/api/jobs/[jobId]/status` SSE route — already handles all queues via Redis pub/sub

### Notifications Data Model

```
notifications
  id           int PK
  user_id      int FK
  type         enum: match_complete | tailor_complete | match_failed | tailor_failed
  title        string
  message      string
  data         jsonb  (e.g. { analysisId, matchScore })
  read         bool default false
  created_at   timestamp
```

Workers write notifications directly (no email sent for matching/tailoring jobs).

---

## Frontend

### New `useJobsStore` (Zustand)

```ts
jobs: Map<jobId, {
  type: 'matching' | 'tailoring'
  status: 'pending' | 'active' | 'completed' | 'failed'
  step?: string
  analysisId?: number
}>
addJob(jobId, type)   // opens SSE connection, updates store on events
removeJob(jobId)
activePendingJobs     // derived: jobs where status is pending | active
```

SSE connections are managed centrally here — one per active job, closed on complete/fail.

### `useMatcher` changes

- Calls `POST /api/matcher/match`, receives `{ jobId }`
- Calls `useJobsStore.addJob(jobId, 'matching')`
- Advances stepper to step 3 immediately
- Removes `analysisMutation` blocking call and `useLoadingStore` dependency
- On SSE `completed` event: `useAnalysisStore.setResults()` populates results

### `useTailorCv` changes

- Calls `POST /api/matcher/tailor-cv`, receives `{ jobId }`
- Calls `useJobsStore.addJob(jobId, 'tailoring')`
- Returns immediately — no blocking state

### `MatcherClient` (stepper step 3)

- If matching job active: animated progress steps (`Parsing documents → Analyzing match → Calculating score`)
- On SSE `completed`: results auto-render
- No manual "loading" spinner needed

### `AnalysisResults` — Tailored CV tab

- If tailoring job active: inline skeleton with current step label
- On SSE `completed`: tailored CV auto-fills without re-render of entire component

### New `JobsStatusBanner`

- Location: `dashboard/layout.tsx` (fixed bottom strip)
- Only visible when `activePendingJobs.length > 0`
- Shows each active job as a pill: spinner + label ("Analyzing match…", "Tailoring CV…")
- Slides in/out with CSS transition
- Disappears automatically when all jobs complete

### New `NotificationBell`

- Location: `dashboard-nav.tsx`
- Bell icon with red unread count badge
- Dropdown panel:
  - Lists notifications sorted newest first
  - Each item: title, message, relative timestamp, read/unread indicator
  - Clicking marks as read and navigates to relevant analysis
  - "Mark all read" action
- Fetches via `GET /api/notifications` on mount + after each job completion

---

## UX Summary

| State | Stepper step 3 | Banner | Bell |
|---|---|---|---|
| Job queued/active | Animated progress steps | Active job pill shown | No change |
| Job completed | Results auto-render | Pill disappears | New unread notification |
| Job failed | Error state inline | Pill disappears | New unread failed notification |
| Tailoring active | Inline skeleton in tab | Active job pill shown | No change |
| Tailoring complete | CV auto-fills | Pill disappears | New unread notification |

---

## Out of Scope

- Email notifications for matching/tailoring (replaced by in-app)
- Push notifications / service workers
- Notification preferences/settings
