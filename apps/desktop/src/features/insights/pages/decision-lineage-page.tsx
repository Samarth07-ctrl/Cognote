import * as React from 'react'
import { GitBranch, ChevronDown, ChevronUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { insightsApi } from '@cognote/api-client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SkeletonCard } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/error-state'
import { EmptyState } from '@/components/ui/empty-state'
import { formatDate } from '@/lib/utils'
import type { DecisionStatus } from '@cognote/types'

const statusVariant: Record<DecisionStatus, 'muted' | 'default' | 'success' | 'warning' | 'destructive'> = {
  proposed: 'muted',
  decided: 'default',
  implemented: 'success',
  superseded: 'warning',
  reverted: 'destructive',
}

export function DecisionLineagePage() {
  const decisionsQuery = useQuery({
    queryKey: ['insights', 'decisions'],
    queryFn: () => insightsApi.getDecisions(),
  })

  const [expanded, setExpanded] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div className="space-y-1">
        <h1 className="text-base font-semibold text-foreground">Decision Lineage</h1>
        <p className="text-sm text-muted-foreground">
          Trace organizational decisions — from problem to outcome — with full evidence.
        </p>
      </div>

      {decisionsQuery.isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {decisionsQuery.isError && (
        <ErrorState variant="server" onRetry={() => void decisionsQuery.refetch()} />
      )}

      {decisionsQuery.data?.length === 0 && (
        <EmptyState
          icon={<GitBranch />}
          title="No decisions extracted yet"
          description="Cognote will extract decisions from your documents once the intelligence engine is connected in Phase 12."
        />
      )}

      {decisionsQuery.data?.map((decision) => {
        const isExpanded = expanded === decision.id
        return (
          <Card key={decision.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate">{decision.title}</CardTitle>
                  <CardDescription className="mt-0.5">
                    {formatDate(decision.date)}
                    {decision.ownerName ? ` · ${decision.ownerName}` : ''}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={statusVariant[decision.status]}>
                    {decision.status.charAt(0).toUpperCase() + decision.status.slice(1)}
                  </Badge>
                  <Badge variant="muted">{decision.confidence} confidence</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
              <p className="text-sm text-muted-foreground">{decision.problem}</p>

              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : decision.id)}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                aria-expanded={isExpanded}
              >
                {isExpanded ? (
                  <ChevronUp className="size-3.5" aria-hidden="true" />
                ) : (
                  <ChevronDown className="size-3.5" aria-hidden="true" />
                )}
                {isExpanded ? 'Hide lineage' : 'Show full lineage'}
              </button>

              {isExpanded && (
                <div className="space-y-3 border-l-2 border-primary/20 pl-4 mt-2">
                  {[
                    { label: 'Decision', value: decision.decision },
                    { label: 'Alternatives considered', value: decision.alternatives.join(', ') },
                    { label: 'Key reasons', value: decision.reasons.join(' · ') },
                    decision.implementation
                      ? { label: 'Implementation', value: decision.implementation }
                      : null,
                    decision.outcome ? { label: 'Outcome', value: decision.outcome } : null,
                  ]
                    .filter((item): item is { label: string; value: string } => item !== null)
                    .map((item) => (
                      <div key={item.label}>
                        <p className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-sm text-foreground mt-0.5">{item.value}</p>
                      </div>
                    ))}

                  {decision.evidence.length > 0 && (
                    <div>
                      <p className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Evidence
                      </p>
                      {decision.evidence.map((e) => (
                        <p key={e.documentId} className="text-xs text-muted-foreground truncate">
                          · {e.documentTitle}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
