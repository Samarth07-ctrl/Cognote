import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MessageSquare, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { knowledgeApi, activityApi } from '@cognote/api-client'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { useSyncStore } from '@/features/sync/store/sync-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { SkeletonCard, SkeletonRow } from '@/components/ui/skeleton'
import { ConnectionIndicator } from '@/components/ui/status-badge'
import { ErrorState } from '@/components/ui/error-state'
import { formatRelativeTime, formatNumber } from '@/lib/utils'
import type { ActivityItem } from '@cognote/types'

function greeting(name: string): string {
  const hour = new Date().getHours()
  if (hour < 12) return `Good morning, ${name}.`
  if (hour < 17) return `Good afternoon, ${name}.`
  return `Good evening, ${name}.`
}

function ActivityIcon({ type }: { type: ActivityItem['type'] }) {
  switch (type) {
    case 'file_indexed':
    case 'file_updated':
    case 'sync_completed':
      return <CheckCircle2 className="size-4 text-success shrink-0" aria-hidden="true" />
    case 'duplicate_detected':
    case 'knowledge_conflict':
      return <AlertTriangle className="size-4 text-warning shrink-0" aria-hidden="true" />
    default:
      return <Info className="size-4 text-primary shrink-0" aria-hidden="true" />
  }
}

export function HomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const connectionStatus = useSyncStore((s) => s.status.connectionStatus)
  const syncCounts = useSyncStore((s) => s.status.counts)
  const [searchQuery, setSearchQuery] = React.useState('')

  const statsQuery = useQuery({
    queryKey: ['knowledge', 'stats'],
    queryFn: () => knowledgeApi.getKnowledgeStats(),
  })

  const activityQuery = useQuery({
    queryKey: ['activity', 'recent'],
    queryFn: () => activityApi.getRecentActivity(5),
  })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      void navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const firstName = user?.name.split(' ')[0] ?? 'there'

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      {/* Greeting + search */}
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-foreground">{greeting(firstName)}</h1>
        <form onSubmit={handleSearch} className="max-w-xl">
          <Input
            type="search"
            placeholder="Search your organization's knowledge…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search />}
            rightElement={
              searchQuery ? (
                <button
                  type="submit"
                  className="pointer-events-auto text-primary hover:text-primary/80 text-xs font-medium"
                >
                  Search
                </button>
              ) : undefined
            }
            className="h-10 text-sm"
          />
        </form>
      </div>

      {/* Knowledge stats */}
      <section aria-labelledby="stats-heading">
        <h2
          id="stats-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Knowledge
        </h2>
        {statsQuery.isError ? (
          <ErrorState variant="server" onRetry={() => void statsQuery.refetch()} />
        ) : statsQuery.isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Documents', value: formatNumber(statsQuery.data?.documentCount ?? 0) },
              { label: 'Indexed Chunks', value: formatNumber(statsQuery.data?.chunkCount ?? 0) },
              { label: 'Entities', value: formatNumber(statsQuery.data?.entityCount ?? 0) },
              { label: 'Relationships', value: formatNumber(statsQuery.data?.relationshipCount ?? 0) },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Recent activity */}
      <section aria-labelledby="activity-heading">
        <h2
          id="activity-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Recent Activity
        </h2>
        <Card>
          {activityQuery.isError ? (
            <CardContent>
              <ErrorState variant="server" className="py-8" />
            </CardContent>
          ) : activityQuery.isLoading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : !activityQuery.data?.length ? (
            <CardContent>
              <p className="py-6 text-center text-sm text-muted-foreground">
                No recent activity yet. Connect a folder to begin building your knowledge base.
              </p>
            </CardContent>
          ) : (
            <div className="divide-y divide-border">
              {activityQuery.data.map((item) => (
                <div key={item.id} className="flex items-start gap-3 px-4 py-3">
                  <ActivityIcon type={item.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="actions-heading">
        <h2
          id="actions-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void navigate('/search')}>
            <Search className="size-4" aria-hidden="true" />
            Search Knowledge
          </Button>
          <Button variant="outline" onClick={() => void navigate('/ask')}>
            <MessageSquare className="size-4" aria-hidden="true" />
            Ask Cognote
          </Button>
          <Button variant="outline" onClick={() => void navigate('/insights/waste')}>
            <AlertTriangle className="size-4" aria-hidden="true" />
            Review Duplicates
          </Button>
        </div>
      </section>

      {/* Status bar */}
      <div className="flex items-center gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
        <ConnectionIndicator status={connectionStatus} />
        <span className="h-3 w-px bg-border" />
        <span>{syncCounts.processed.toLocaleString()} files indexed</span>
        <span className="h-3 w-px bg-border" />
        <span>3 authorized folders</span>
      </div>
    </div>
  )
}
