import * as React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shape variant */
  variant?: 'rect' | 'circle' | 'text'
}

function Skeleton({ className, variant = 'rect', ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-skeleton-pulse bg-muted',
        variant === 'circle' && 'rounded-full',
        variant === 'rect' && 'rounded-md',
        variant === 'text' && 'rounded h-4',
        className
      )}
      {...props}
    />
  )
}

/** Pre-built skeleton for a typical list row */
function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 p-3', className)} aria-hidden="true">
      <Skeleton variant="circle" className="size-8 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-2/3" />
        <Skeleton variant="text" className="w-1/3 h-3" />
      </div>
    </div>
  )
}

/** Pre-built skeleton for a stat card */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn('rounded-lg border border-border bg-card p-4 space-y-3', className)}
      aria-hidden="true"
    >
      <Skeleton variant="text" className="w-1/3 h-3" />
      <Skeleton variant="text" className="w-1/2 h-6" />
      <Skeleton variant="text" className="w-2/3 h-3" />
    </div>
  )
}

/** Pre-built skeleton for a table row */
function SkeletonTableRow({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 border-b border-border px-4 py-3" aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} variant="text" className="h-3 flex-1" />
      ))}
    </div>
  )
}

export { Skeleton, SkeletonRow, SkeletonCard, SkeletonTableRow }
