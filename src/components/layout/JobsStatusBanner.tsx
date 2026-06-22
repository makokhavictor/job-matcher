'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, X } from 'lucide-react'
import { useJobsStore } from '@/stores/jobs.store'
import type { JobEntry } from '@/stores/jobs.store'

function jobLabel(job: JobEntry): string {
  if (job.type === 'matching') {
    if (job.status === 'pending') return 'Queued: Analyzing match…'
    if (job.step) return `Analyzing: ${job.step.replace(/_/g, ' ')}`
    return 'Analyzing match…'
  }
  if (job.type === 'tailoring') {
    if (job.status === 'pending') return 'Queued: Tailoring CV…'
    return 'Tailoring CV…'
  }
  return 'Processing…'
}

export function JobsStatusBanner() {
  const jobs = useJobsStore((state) => state.jobs)
  const removeJob = useJobsStore((state) => state.removeJob)

  const activeJobs = Array.from(jobs.values()).filter(
    (j) => j.status === 'pending' || j.status === 'active'
  )

  return (
    <AnimatePresence>
      {activeJobs.length > 0 && (
        <motion.div
          key="jobs-banner"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg"
        >
          <div className="container px-6 py-3 flex items-center gap-4 overflow-x-auto">
            <span className="text-xs font-medium text-muted-foreground shrink-0">
              {activeJobs.length === 1 ? '1 job running' : `${activeJobs.length} jobs running`}
            </span>
            <div className="flex items-center gap-3 flex-1">
              {activeJobs.map((job) => (
                <div
                  key={job.jobId}
                  className="flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-sm shrink-0"
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
                  <span className="text-foreground/80">{jobLabel(job)}</span>
                  <button
                    onClick={() => removeJob(job.jobId)}
                    className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
