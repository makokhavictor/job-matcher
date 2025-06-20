'use client'

import React from 'react'
import { useLoadingStore } from '@/stores/loading.store'

export function LoadingMask() {
  const isLoading = useLoadingStore((state) => state.isLoading)
  if (!isLoading) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-secondary-50/60 dark:bg-secondary-900/60 backdrop-blur-sm">
      <span className="relative flex h-16 w-16 mb-6">
        <span className="animate-spin absolute inline-flex h-full w-full rounded-full border-4 border-primary border-t-transparent"></span>
        <span className="sr-only">Loading...</span>
      </span>
      <span className="text-secondary-600 dark:text-secondary-200 text-base font-medium">
        Hold on, we’re working our magic...
      </span>
    </div>
  )
}
