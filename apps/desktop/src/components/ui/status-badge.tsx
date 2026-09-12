import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { FileProcessingStatus, SyncConnectionStatus } from '@cognote/types'

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-2xs font-medium',
  {
    variants: {
      status: {
        connected: 'bg-success/10 text-success',
        connecting: 'bg-warning/10 text-warning',
        disconnected: 'bg-muted text-muted-foreground',
        error: 'bg-destructive/10 text-destructive',
        indexed: 'bg-success/10 text-success',
        processed: 'bg-primary/10 text-primary',
        processing: 'bg-warning/10 text-warning',
        queued: 'bg-muted text-muted-foreground',
        discovered: 'bg-muted text-muted-foreground',
        failed: 'bg-destructive/10 text-destructive',
        ignored: 'bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      status: 'disconnected',
    },
  }
)

const dotVariants = cva('size-1.5 rounded-full', {
  variants: {
    status: {
      connected: 'bg-success',
      connecting: 'bg-warning animate-pulse',
      disconnected: 'bg-muted-foreground',
      error: 'bg-destructive',
      indexed: 'bg-success',
      processed: 'bg-primary',
      processing: 'bg-warning animate-pulse',
      queued: 'bg-muted-foreground',
      discovered: 'bg-muted-foreground',
      failed: 'bg-destructive',
      ignored: 'bg-muted-foreground',
    },
  },
  defaultVariants: { status: 'disconnected' },
})

type StatusValue = FileProcessingStatus | SyncConnectionStatus

const labelMap: Record<string, string> = {
  connected: 'Connected',
  connecting: 'Connecting',
  disconnected: 'Offline',
  error: 'Error',
  INDEXED: 'Indexed',
  PROCESSED: 'Processed',
  PROCESSING: 'Processing',
  QUEUED: 'Queued',
  DISCOVERED: 'Discovered',
  FAILED: 'Failed',
  IGNORED: 'Ignored',
}

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  value: StatusValue
  className?: string
  showDot?: boolean
}

function StatusBadge({ value, className, showDot = true }: StatusBadgeProps) {
  const key = value.toLowerCase() as NonNullable<VariantProps<typeof statusBadgeVariants>>['status']
  const label = labelMap[value] ?? value

  return (
    <span className={cn(statusBadgeVariants({ status: key }), className)}>
      {showDot && <span className={dotVariants({ status: key })} aria-hidden="true" />}
      {label}
    </span>
  )
}

/** Inline connection indicator used in the topbar / footer */
function ConnectionIndicator({
  status,
  className,
}: {
  status: SyncConnectionStatus
  className?: string
}) {
  return <StatusBadge value={status} className={className} />
}

export { StatusBadge, ConnectionIndicator }
