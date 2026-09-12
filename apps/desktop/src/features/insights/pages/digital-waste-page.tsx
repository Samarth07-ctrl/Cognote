import * as React from 'react'
import { Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { insightsApi } from '@cognote/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SkeletonCard } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/error-state'
import { EmptyState } from '@/components/ui/empty-state'
import { formatBytes, formatNumber } from '@/lib/utils'

export function DigitalWastePage() {
  const wasteQuery = useQuery({
    queryKey: ['insights', 'waste'],
    queryFn: () => insightsApi.getWasteSummary(),
  })

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div className="space-y-1">
        <h1 className="text-base font-semibold text-foreground">Digital Waste</h1>
        <p className="text-sm text-muted-foreground">
          Potential duplicate, outdated, and redundant knowledge detected across your organization.
        </p>
      </div>

      {wasteQuery.isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {wasteQuery.isError && (
        <ErrorState variant="server" onRetry={() => void wasteQuery.refetch()} />
      )}

      {wasteQuery.data && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: 'Exact Duplicates', value: formatNumber(wasteQuery.data.exactDuplicates), variant: 'destructive' as const },
              { label: 'Near Duplicates', value: formatNumber(wasteQuery.data.nearDuplicates), variant: 'warning' as const },
              { label: 'Semantic Duplicates', value: formatNumber(wasteQuery.data.semanticDuplicates), variant: 'warning' as const },
              { label: 'Outdated Documents', value: formatNumber(wasteQuery.data.outdatedDocuments), variant: 'warning' as const },
              { label: 'Redundant Knowledge', value: formatNumber(wasteQuery.data.redundantKnowledge), variant: 'muted' as const },
              { label: 'Estimated Waste', value: formatBytes(wasteQuery.data.estimatedWasteBytes), variant: 'muted' as const },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Overall waste level:</span>
            <Badge
              variant={
                wasteQuery.data.wasteLevel === 'high'
                  ? 'destructive'
                  : wasteQuery.data.wasteLevel === 'medium'
                    ? 'warning'
                    : 'success'
              }
            >
              {wasteQuery.data.wasteLevel.charAt(0).toUpperCase() + wasteQuery.data.wasteLevel.slice(1)}
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Duplicate Pairs</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<Trash2 />}
                title="Duplicate review coming in Phase 11"
                description="Individual duplicate pairs will be listed here once the intelligence engine is connected."
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
