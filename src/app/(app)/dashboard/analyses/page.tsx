'use client'

import { useState } from 'react'
import { useAnalysisStore } from '@/stores/analysis.store'
import { columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { Spinner } from '@/components/ui/spinner'
import { AnalysisResults } from '@/components/analysis/AnalysisResults'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function AnalysesPage() {
  const { recentAnalyses, loading, error, setResults } = useAnalysisStore()
  const [open, setOpen] = useState(false)

  const handleViewDetails = (analysis: typeof recentAnalyses[0]) => {
    setResults(analysis.result_data)
    setOpen(true)
  }

  if (loading) return (
    <div className="container py-8 flex items-center justify-center min-h-[200px]">
      <Spinner size={32} />
    </div>
  )
  if (error) return <div className="container py-8 text-red-600">Error: {error}</div>

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Analysis History</h1>
      <DataTable columns={columns} data={recentAnalyses} meta={{ onViewDetails: handleViewDetails }} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>Analysis Details</DialogTitle>
          </DialogHeader>
          <div className="max-h-[80vh] overflow-y-auto">
            <AnalysisResults />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
