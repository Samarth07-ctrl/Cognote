import * as React from 'react'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizeMap = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
}

function Spinner({ size = 'md', className, label = 'Loading…' }: SpinnerProps) {
  return (
    <svg
      className={cn('animate-spin text-muted-foreground', sizeMap[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label={label}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

/** Full-area centered loading state */
function LoadingOverlay({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground"
      role="status"
      aria-label={label}
    >
      <Spinner size="lg" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export { Spinner, LoadingOverlay }
