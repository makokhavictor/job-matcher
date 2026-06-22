import { useEffect } from 'react'
import { useCareerPositionStore } from '@/stores/career-position.store'

type SSEEvent = {
  event: string
  data: Record<string, unknown>
}

export function useJobStatus(jobId: string | null) {
  const { setJobStatus, jobStatus } = useCareerPositionStore()

  useEffect(() => {
    if (!jobId || jobStatus === 'completed' || jobStatus === 'failed') return

    const es = new EventSource(`/api/jobs/${jobId}/status`)

    es.onmessage = (e) => {
      try {
        const parsed: SSEEvent = JSON.parse(e.data)
        if (parsed.event === 'active') {
          const step = parsed.data.step as 'extracting_skills' | 'mapping_industry' | 'calculating_score'
          setJobStatus('active', step)
        } else if (parsed.event === 'completed') {
          setJobStatus('completed')
          es.close()
        } else if (parsed.event === 'failed') {
          setJobStatus('failed')
          es.close()
        } else if (parsed.event === 'timeout') {
          setJobStatus('timeout' as Parameters<typeof setJobStatus>[0])
          es.close()
        }
      } catch {
        // ignore parse errors
      }
    }

    es.onerror = () => {
      setJobStatus('failed')
      es.close()
    }

    return () => es.close()
  }, [jobId, jobStatus, setJobStatus])
}
