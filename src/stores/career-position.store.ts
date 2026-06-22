import { create } from 'zustand'
import { careerPositionService, CareerTarget, CareerPositionResult } from '@/lib/career-position.service'

type QueueStep = 'extracting_skills' | 'mapping_industry' | 'calculating_score'
type JobStatus = 'idle' | 'queued' | 'active' | 'completed' | 'failed' | 'timeout'

interface CareerPositionState {
  savedTarget: CareerTarget | null
  latestResult: CareerPositionResult | null
  currentJobId: string | null
  jobStatus: JobStatus
  activeStep: QueueStep | null
  loading: boolean
  error: string | null

  fetchSavedTarget: () => Promise<void>
  fetchLatestResult: () => Promise<void>
  setJobId: (jobId: string) => void
  setJobStatus: (status: JobStatus, step?: QueueStep) => void
  setLatestResult: (result: CareerPositionResult) => void
  reset: () => void
}

export const useCareerPositionStore = create<CareerPositionState>((set) => ({
  savedTarget: null,
  latestResult: null,
  currentJobId: null,
  jobStatus: 'idle',
  activeStep: null,
  loading: false,
  error: null,

  fetchSavedTarget: async () => {
    const target = await careerPositionService.getSavedTarget()
    set({ savedTarget: target })
  },

  fetchLatestResult: async () => {
    set({ loading: true, error: null })
    try {
      const result = await careerPositionService.getLatestResult()
      set({ latestResult: result, loading: false })
    } catch (e) {
      set({ error: String(e), loading: false })
    }
  },

  setJobId: (jobId) => set({ currentJobId: jobId, jobStatus: 'queued' }),

  setJobStatus: (status, step) => set({ jobStatus: status, activeStep: step ?? null }),

  setLatestResult: (result) => set({ latestResult: result, jobStatus: 'completed' }),

  reset: () => set({ currentJobId: null, jobStatus: 'idle', activeStep: null, error: null }),
}))
