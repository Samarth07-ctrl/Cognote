import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, GitBranch, HeartPulse, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { insightsApi } from '@cognote/api-client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SkeletonCard } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/error-state'
import { formatBytes } from '@/lib/utils'

export function InsightsPage() {
  const navigate = useNavigate()

  const wasteQuery = useQuery({
    queryKey: ['insights', 'waste'],
    queryFn: () => insightsApi.getWasteSummary(),
  })

  const healthQuery = useQuery({
    queryKey: ['insights', 'health'],
    queryFn: () => insightsApi.getKnowledgeHealthScore(),
  })

  if (wasteQuery.isError || healthQuery.isError) {
    return (
      <div className="p-6">
        <ErrorState
          variant="server"
          onRetry={() => {
            void wasteQuery.refetch()
            void healthQuery.refetch()
          }}
        />
      </div>
    )
  }

  const isLoading = wasteQuery.isLoading || healthQuery.isLoading

  const cards = [
    {
      to: '/insights/waste',
      icon: <Trash2 className="size-5 text-warning" aria-hidden="true" />,
      title: 'Digital Waste',
      description: 'Identify duplicate, outdated, and redundant knowledge.',
      badge: wasteQuery.data
        ? `${(wasteQuery.data.exactDuplicates + wasteQuery.data.nearDuplicates).toLocaleString()} potential issues`
        : null,
      badgeVariant: 'warning' as const,
      stat: wasteQuery.data ? `${formatBytes(wasteQuery.data.estimatedWasteBytes)} estimated waste` : null,
    },
    {
      to: '/insights/decisions',
      icon: <GitBranch className="size-5 text-primary" aria-hidden="true" />,
      title: 'Decision Lineage',
      description: 'Trace organizational decisions back to their evidence and context.',
      badge: null,
      stat: 'Coming in Phase 12',
    },
    {
      to: '/insights/health',
      icon: <HeartPulse className="size-5 text-success" aria-hidden="true" />,
      title: 'Knowledge Health',
      description: 'Measure documentation quality, ownership, and coverage.',
      badge: healthQuery.data ? `Score: ${healthQuery.data.overall}/100` : null,
      badgeVariant:
        healthQuery.data && healthQuery.data.overall >= 80 ? ('success' as const) : ('warning' as const),
      stat: null,
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div className="space-y-1">
        <h1 className="text-base font-semibold text-foreground">Insights</h1>
        <p className="text-sm text-muted-foreground">
          Intelligence layer — understand, improve, and de-risk your organization's knowledge.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : cards.map((card) => (
              <Card
                key={card.to}
                className="cursor-pointer hover:bg-accent/30 transition-colors"
                onClick={() => void navigate(card.to)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void navigate(card.to)
                }}
                aria-label={card.title}
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {card.icon}
                      <div>
                        <CardTitle>{card.title}</CardTitle>
                        <CardDescription className="mt-0.5">{card.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {card.badge && (
                        <Badge variant={card.badgeVariant ?? 'default'}>{card.badge}</Badge>
                      )}
                      <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                  </div>
                </CardHeader>
                {card.stat && (
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">{card.stat}</p>
                  </CardContent>
                )}
              </Card>
            ))}
      </div>
    </div>
  )
}
