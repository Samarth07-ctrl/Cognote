import * as React from 'react'
import { Plus, Trash2, FolderOpen, Shield, Clock } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { permissionsApi } from '@cognote/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SkeletonRow } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { pickFolder } from '@/lib/tauri'
import { formatBytes, formatRelativeTime } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

export function PermissionsPage() {
  const queryClient = useQueryClient()

  const foldersQuery = useQuery({
    queryKey: ['permissions', 'folders'],
    queryFn: () => permissionsApi.getFolders(),
  })

  const auditQuery = useQuery({
    queryKey: ['permissions', 'audit'],
    queryFn: () => permissionsApi.getAuditEvents(),
  })

  const addMutation = useMutation({
    mutationFn: permissionsApi.addFolder,
    onSuccess: (newFolder) => {
      void queryClient.invalidateQueries({ queryKey: ['permissions', 'folders'] })
      toast.success('Folder added', newFolder.displayName)
    },
    onError: () => toast.error('Failed to add folder', 'Please try again.'),
  })

  const removeMutation = useMutation({
    mutationFn: permissionsApi.removeFolder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['permissions', 'folders'] })
      toast.success('Folder removed')
    },
    onError: () => toast.error('Failed to remove folder'),
  })

  const toggleMonitorMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      permissionsApi.updateFolder(id, { monitoringEnabled: enabled }),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ['permissions', 'folders'] }),
    onError: () => toast.error('Failed to update monitoring'),
  })

  async function handleAddFolder() {
    try {
      const result = await pickFolder()
      if (!result) return
      addMutation.mutate({
        path: result.path,
        displayName: result.displayName,
        permissionType: 'read',
        monitoringEnabled: true,
      })
    } catch {
      // Dev fallback — Tauri native picker not available in browser
      addMutation.mutate({
        path: 'C:\\Company\\NewFolder',
        displayName: 'New Folder (dev)',
        permissionType: 'read',
        monitoringEnabled: true,
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-base font-semibold text-foreground">Permissions</h1>
          <p className="text-sm text-muted-foreground">
            Manage the folders Cognote is authorized to analyze. You are always in control.
          </p>
        </div>
        <Button size="sm" onClick={() => void handleAddFolder()} loading={addMutation.isPending}>
          <Plus className="size-4" aria-hidden="true" />
          Add Folder
        </Button>
      </div>

      {/* Authorized folders */}
      <section aria-labelledby="folders-heading">
        <h2
          id="folders-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Authorized Folders
        </h2>

        {foldersQuery.isError && (
          <ErrorState variant="server" onRetry={() => void foldersQuery.refetch()} />
        )}

        {foldersQuery.isLoading && (
          <Card>
            <div className="divide-y divide-border">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          </Card>
        )}

        {foldersQuery.data?.length === 0 && (
          <EmptyState
            icon={<Shield />}
            title="No authorized folders"
            description="Add folders to let Cognote analyze your company's knowledge."
            action={{ label: 'Add Folder', onClick: () => void handleAddFolder() }}
          />
        )}

        {foldersQuery.data && foldersQuery.data.length > 0 && (
          <Card>
            <div className="divide-y divide-border">
              {foldersQuery.data.map((folder) => (
                <div key={folder.id} className="flex items-center gap-3 px-4 py-3">
                  <FolderOpen className="size-5 text-primary shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{folder.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{folder.path}</p>
                    {folder.fileCount !== undefined && (
                      <p className="text-2xs text-muted-foreground">
                        {folder.fileCount.toLocaleString()} files
                        {folder.sizeBytes !== undefined
                          ? ` · ${formatBytes(folder.sizeBytes)}`
                          : ''}
                      </p>
                    )}
                  </div>

                  {/* Monitoring toggle */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={folder.monitoringEnabled ? 'success' : 'muted'}>
                      {folder.monitoringEnabled ? 'Monitoring ON' : 'Monitoring OFF'}
                    </Badge>
                    <button
                      type="button"
                      onClick={() =>
                        toggleMonitorMutation.mutate({
                          id: folder.id,
                          enabled: !folder.monitoringEnabled,
                        })
                      }
                      className="text-xs text-primary hover:underline"
                      aria-label={`${folder.monitoringEnabled ? 'Disable' : 'Enable'} monitoring for ${folder.displayName}`}
                    >
                      {folder.monitoringEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeMutation.mutate(folder.id)}
                    disabled={removeMutation.isPending}
                    className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    aria-label={`Remove ${folder.displayName}`}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>

      {/* Audit history */}
      <section aria-labelledby="audit-heading">
        <h2
          id="audit-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Permission History
        </h2>
        <Card>
          {auditQuery.isLoading && (
            <div className="divide-y divide-border">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          )}
          {auditQuery.data?.length === 0 && (
            <CardContent>
              <p className="py-4 text-center text-sm text-muted-foreground">
                No permission changes recorded.
              </p>
            </CardContent>
          )}
          {auditQuery.data && auditQuery.data.length > 0 && (
            <div className="divide-y divide-border">
              {auditQuery.data.map((event) => (
                <div key={event.id} className="flex items-start gap-3 px-4 py-3">
                  <Clock className="size-4 text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="flex-1 min-w-0 text-sm text-foreground">{event.detail}</p>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatRelativeTime(event.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}
