import * as React from 'react'
import { HeartPulse, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { insightsApi } from '@cognote/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { SkeletonCard } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/error-state'
import type { KnowledgeRisk } from '@cognote/types'

function RiskIcon({ severity }: { severity: KnowledgeRisk['severity'] }) {
  if (severity === 'critical')
    return <AlertCircle className="size-4 text-destructive shrink-0" aria-hidden="true" />
  if (severity === 'warning')
    return <AlertTriangle className="size-4 text-warning shrink-0" aria-hidden="true" />
  return <Info className="size-4 text-primary shrink-0" aria-hidden="true" />
}

function scoreColor(score: number): 'success' | 'warning' | 'destructive' {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'destructive'
}

export function KnowledgeHealthPage() {
  const healthQuery = useQuery({
    queryKey: ['insights', 'health'],
    queryFn: () => insightsApi.getKnowledgeHealthScore(),
  })
  const risksQuery = useQuery({
    queryKey: ['insights', 'risks'],
    queryFn: () => insightsApi.getKnowledgeRisks(),
  })

  if (healthQuery.isError || risksQuery.isError) {
    return (
      <div className="p-6">
        <ErrorState
          variant="server"
          onRetry={() => {
            void healthQuery.refetch()
            void risksQuery.refetch()
          }}
        />
      </div>
    )
  }

  const metrics = healthQuery.data
    ? [
        { label: 'Documentation Quality', value: healthQuery.data.documentationQuality },
        { label: 'Ownership', value: healthQuery.data.ownership },
        { label: 'Version Consistency', value: healthQuery.data.versionConsistency },
        { label: 'Decision Completeness', value: healthQuery.data.decisionCompleteness },
        { label: 'Duplicate Ratio', value: healthQuery.data.duplicateRatio },
        { label: 'Knowledge Distribution', value: healthQuery.data.knowledgeDistribution },
        { label: 'Conflict Rate', value: healthQuery.data.conflictRate },
      ]
    : []

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div className="space-y-1">
        <h1 className="text-base font-semibold text-foreground">Knowledge Health</h1>
        <p className="text-sm text-muted-foreground">
          Overall quality, ownership, and risk analysis of your organization's knowledge base.
        </p>
      </div>

      {(healthQuery.isLoading || risksQuery.isLoading) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {healthQuery.data && (
        <>
          {/* Overall score */}
          <Card>
            <CardContent className="p-6 flex items-center gap-6">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-primary bg-primary/10">
                <span className="text-2xl font-bold text-primary tabular-nums">
                  {healthQuery.data.overall}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-foreground">
                  Organization Knowledge Health
                </p>
                <p className="text-sm text-muted-foreground">
                  {healthQuery.data.overall >= 80
                    ? 'Your knowledge base is in good shape overall.'
                    : healthQuery.data.overall >= 60
                      ? 'Several areas need attention to improve quality.'
                      : 'Significant knowledge quality issues detected.'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <HeartPulse className="size-4 text-primary" aria-hidden="true" />
                  <span className="text-xs text-muted-foreground">Score out of 100 · Updated today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dimension breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {metrics.map((m) => (
                <div key={m.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{m.label}</span>
                    <span className="text-sm font-medium tabular-nums text-foreground">
                      {m.value}
                    </span>
                  </div>
                  <Progress value={m.value} color={scoreColor(m.value)} size="sm" />
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {/* Risk alerts */}
      {risksQuery.data && risksQuery.data.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Knowledge Risks
          </h2>
          {risksQuery.data.map((risk) => (
            <div
              key={risk.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3"
            >
              <RiskIcon severity={risk.severity} />
              <p className="flex-1 min-w-0 text-sm text-foreground">{risk.description}</p>
              <Badge
                variant={
                  risk.severity === 'critical'
                    ? 'destructive'
                    : risk.severity === 'warning'
                      ? 'warning'
                      : 'default'
                }
                className="shrink-0"
              >
                {risk.severity}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
