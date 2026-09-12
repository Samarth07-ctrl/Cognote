import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, FileText, Clock, User } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { searchApi } from '@cognote/api-client'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SkeletonRow } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { formatRelativeTime } from '@/lib/utils'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = React.useState(searchParams.get('q') ?? '')
  const [submittedQuery, setSubmittedQuery] = React.useState(searchParams.get('q') ?? '')

  const searchQuery = useQuery({
    queryKey: ['search', submittedQuery],
    queryFn: () => searchApi.search({ query: submittedQuery, limit: 20 }),
    enabled: submittedQuery.trim().length > 0,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    setSubmittedQuery(q)
    setSearchParams(q ? { q } : {})
  }

  return (
    <div className="flex flex-col gap-4 p-6 max-w-3xl">
      {/* Search bar */}
      <div className="space-y-1">
        <h1 className="text-base font-semibold text-foreground">Search</h1>
        <form onSubmit={handleSubmit}>
          <Input
            type="search"
            placeholder="Search your organization's knowledge…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search />}
            className="h-10"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      </div>

      {/* Results meta */}
      {searchQuery.data && submittedQuery && (
        <p className="text-xs text-muted-foreground">
          {searchQuery.data.total} result{searchQuery.data.total !== 1 ? 's' : ''} for{' '}
          <span className="font-medium text-foreground">"{submittedQuery}"</span>
          {' '}— {searchQuery.data.durationMs}ms
        </p>
      )}

      {/* Empty prompt */}
      {!submittedQuery && (
        <EmptyState
          icon={<Search />}
          title="Search your organization's knowledge"
          description="Try: authentication architecture, Project Alpha, why PostgreSQL…"
        />
      )}

      {/* Loading */}
      {searchQuery.isLoading && (
        <Card>
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        </Card>
      )}

      {/* Error */}
      {searchQuery.isError && (
        <ErrorState variant="server" onRetry={() => void searchQuery.refetch()} />
      )}

      {/* No results */}
      {searchQuery.data?.total === 0 && (
        <EmptyState
          icon={<Search />}
          title="No results found"
          description={`No documents match "${submittedQuery}". Try different keywords or fewer filters.`}
        />
      )}

      {/* Result list */}
      {searchQuery.data && searchQuery.data.results.length > 0 && (
        <div className="space-y-2">
          {searchQuery.data.results.map((result) => (
            <Card
              key={result.id}
              className="cursor-pointer transition-colors hover:bg-accent/40 focus-within:ring-2 focus-within:ring-ring"
            >
              <div className="px-4 py-3 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
                    <h3 className="text-sm font-medium text-foreground truncate">{result.title}</h3>
                  </div>
                  <Badge variant="muted" className="shrink-0">{result.documentType}</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="truncate">{result.source}</span>
                  {result.ownerName && (
                    <>
                      <span className="h-3 w-px bg-border shrink-0" />
                      <span className="flex items-center gap-1 shrink-0">
                        <User className="size-3" aria-hidden="true" />
                        {result.ownerName}
                      </span>
                    </>
                  )}
                  <span className="h-3 w-px bg-border shrink-0" />
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock className="size-3" aria-hidden="true" />
                    {formatRelativeTime(result.updatedAt)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{result.excerpt}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
