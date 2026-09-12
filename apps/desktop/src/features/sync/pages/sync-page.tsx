import * as React from 'react'
import { RefreshCw, PauseCircle, PlayCircle, CheckCircle2, Clock, XCircle, MinusCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { syncApi, filesApi } from '@cognote/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { SkeletonRow } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/error-state'
import { EmptyState } from '@/components/ui/empty-state'
import { Progress } from '@/components/ui/progress'
import { useSyncStore } from '@/features/sync/store/sync-store'
import { formatRelativeTime, formatBytes, formatNumber } from '@/lib/utils'
import type { DiscoveredFile } from '@cognote/types'
import { toast } from '@/hooks/use-toast'

function FileStatusIcon({ status }: { status: DiscoveredFile['status'] }) {
  switch (status) {
    case 'INDEXED':
      return <CheckCircle2 className="size-4 text-success shrink-0" aria-hidden="true" />
    case 'PROCESSING':
      return <RefreshCw className="size-4 text-warning animate-spin shrink-0" aria-hidden="true" />
    case 'QUEUED':
      return <Clock className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
    case 'FAILED':
      return <XCircle className="size-4 text-destructive shrink-0" aria-hidden="true" />
    case 'IGNORED':
      return <MinusCircle className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
    default:
      return <Clock className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
  }
}

export function SyncPage() {
  const { status: syncStatus, setStatus } = useSyncStore()

  const syncStatusQuery = useQuery({
    queryKey: ['sync', 'status'],
    queryFn: async () => {
      const data = await syncApi.getSyncStatus()
      setStatus(data)
      return data
    },
    refetchInterval: 5000,
  })

  const filesQuery = useQuery({
    queryKey: ['files'],
    queryFn: () => filesApi.getFiles(),
  })

  async function handleSyncNow() {
    try {
      await syncApi.startSync()
      toast.success('Sync started', 'Cognote is scanning your authorized folders.')
    } catch {
      toast.error('Sync failed', 'Could not start synchronization. Try again.')
    }
  }

  async function handlePause() {
    try {
      if (syncStatus.isPaused) {
        await syncApi.resumeSync()
        toast.info('Monitoring resumed')
      } else {
        await syncApi.pauseSync()
        toast.info('Monitoring paused')
      }
      void syncStatusQuery.refetch()
    } catch {
      toast.error('Action failed', 'Could not update sync status.')
    }
  }

  const counts = syncStatusQuery.data?.counts ?? syncStatus.counts
  const totalProcessed = counts.processed + counts.failed + counts.ignored
  const progressPct = counts.total > 0 ? (totalProcessed / counts.total) * 100 : 0

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-base font-semibold text-foreground">Sync Center</h1>
          <p className="text-sm text-muted-foreground">
            Monitor file ingestion, processing status, and sync health.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => void handlePause()}>
            {syncStatus.isPaused ? (
              <>
                <PlayCircle className="size-4" aria-hidden="true" /> Resume
              </>
            ) : (
              <>
                <PauseCircle className="size-4" aria-hidden="true" /> Pause
              </>
            )}
          </Button>
          <Button size="sm" onClick={() => void handleSyncNow()}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Sync Now
          </Button>
        </div>
      </div>

      {syncStatusQuery.isError ? (
        <ErrorState variant="server" onRetry={() => void syncStatusQuery.refetch()} />
      ) : (
        <>
          {/* Status card */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <StatusBadge value={syncStatus.connectionStatus} />
                {syncStatus.lastSyncAt && (
                  <span className="text-xs text-muted-foreground">
                    Last sync {formatRelativeTime(syncStatus.lastSyncAt)}
                  </span>
                )}
              </div>

              <Progress value={progressPct} showLabel />

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: 'Indexed', value: formatNumber(counts.processed), color: 'text-success' },
                  { label: 'Processing', value: formatNumber(counts.processing), color: 'text-warning' },
                  { label: 'Failed', value: formatNumber(counts.failed), color: 'text-destructive' },
                  { label: 'Ignored', value: formatNumber(counts.ignored), color: 'text-muted-foreground' },
                ].map((c) => (
                  <div key={c.label} className="rounded-md bg-muted px-3 py-2">
                    <p className="text-2xs text-muted-foreground">{c.label}</p>
                    <p className={`text-lg font-semibold tabular-nums ${c.color}`}>{c.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* File activity list */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recently Processed
            </h2>
            <Card>
              {filesQuery.isLoading && (
                <div className="divide-y divide-border">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </div>
              )}
              {filesQuery.isError && (
                <CardContent>
                  <ErrorState variant="server" className="py-6" />
                </CardContent>
              )}
              {filesQuery.data?.length === 0 && (
                <CardContent>
                  <EmptyState
                    icon={<RefreshCw />}
                    title="No files yet"
                    description="Files will appear here once indexing begins."
                  />
                </CardContent>
              )}
              {filesQuery.data && filesQuery.data.length > 0 && (
                <div className="divide-y divide-border">
                  {filesQuery.data.map((file) => (
                    <div
                      key={file.id}
                      className="flex flex-col gap-1 px-4 py-3 hover:bg-accent/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileStatusIcon status={file.status} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{file.path}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {formatBytes(file.sizeBytes)}
                          </span>
                          <StatusBadge value={file.status} />
                        </div>
                      </div>
                      {file.status === 'FAILED' && file.failureReason && (
                        <div className="ml-7 mt-1 rounded bg-destructive/10 border border-destructive/20 px-2.5 py-1.5 text-xs text-destructive flex items-center justify-between">
                          <span><strong>Failure reason:</strong> {file.failureReason}</span>
                        </div>
                      )}
                      {file.status === 'IGNORED' && file.ignoreReason && (
                        <div className="ml-7 mt-0.5 text-2xs text-muted-foreground">
                          Skipped: {file.ignoreReason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
