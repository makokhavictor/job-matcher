import React from 'react'

export function Spinner({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`relative flex items-center justify-center h-[${size}px] w-[${size}px] ${className}`}>
      <span className="animate-spin absolute inline-flex h-full w-full rounded-full border-4 border-primary border-t-transparent"></span>
      <span className="sr-only">Loading...</span>
    </span>
  )
} 