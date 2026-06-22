'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { useJobsStore } from '@/stores/jobs.store'
import { Spinner } from '@/components/ui/spinner'

const STEP_LABELS: Record<string, string> = {
  parsing_documents: 'Parsing documents…',
  analyzing_match: 'Analyzing match…',
  calculating_score: 'Calculating score…',
}

interface Props {
  jobId: string
}

export function MatchingProgress({ jobId }: Props) {
  const job = useJobsStore((state) => state.jobs.get(jobId))

  const stepLabel = job?.step ? (STEP_LABELS[job.step] ?? job.step.replace(/_/g, ' ')) : 'Preparing…'

  return (
    <Card className="p-10">
      <div className="flex flex-col items-center gap-6 text-center">
        <Spinner size={56} />
        <div>
          <p className="text-lg font-semibold text-foreground">Analyzing your match</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={stepLabel}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-1 text-sm text-muted-foreground"
            >
              {stepLabel}
            </motion.p>
          </AnimatePresence>
        </div>
        <p className="text-xs text-muted-foreground max-w-xs">
          This usually takes 15–30 seconds. You can leave this page — we&apos;ll notify you when it&apos;s ready.
        </p>
      </div>
    </Card>
  )
}
