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
