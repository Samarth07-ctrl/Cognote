import * as React from 'react'
import { Network, FileText, Users, FolderOpen, Lightbulb } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { knowledgeApi } from '@cognote/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SkeletonCard } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { formatRelativeTime } from '@/lib/utils'
import type { EntityType } from '@cognote/types'

const entityTypeIcon: Record<EntityType, React.ReactNode> = {
  document: <FileText className="size-4" />,
  person: <Users className="size-4" />,
  team: <Users className="size-4" />,
  project: <FolderOpen className="size-4" />,
  decision: <Lightbulb className="size-4" />,
  meeting: <Lightbulb className="size-4" />,
  technology: <Network className="size-4" />,
  repository: <FolderOpen className="size-4" />,
  service: <Network className="size-4" />,
  topic: <Lightbulb className="size-4" />,
}

const entityTypeBadge: Record<EntityType, 'default' | 'success' | 'warning' | 'muted'> = {
  document: 'muted',
  person: 'muted',
  team: 'muted',
  project: 'default',
  decision: 'warning',
  meeting: 'muted',
  technology: 'success',
  repository: 'muted',
  service: 'success',
  topic: 'muted',
}

export function KnowledgePage() {
  const entitiesQuery = useQuery({
    queryKey: ['knowledge', 'entities'],
    queryFn: () => knowledgeApi.getEntities(),
  })

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-base font-semibold text-foreground">Knowledge</h1>
        <p className="text-sm text-muted-foreground">
          Explore the organizational knowledge graph — entities, relationships, and connections.
        </p>
      </div>

      <Tabs defaultValue="entities">
        <TabsList>
          <TabsTrigger value="entities">Entities</TabsTrigger>
          <TabsTrigger value="graph" disabled>
            Graph View
          </TabsTrigger>
          <TabsTrigger value="decisions" disabled>
            Decisions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entities">
          {entitiesQuery.isError && (
            <ErrorState variant="server" onRetry={() => void entitiesQuery.refetch()} />
          )}
          {entitiesQuery.isLoading && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}
          {entitiesQuery.data?.length === 0 && (
            <EmptyState
              icon={<Network />}
              title="No entities yet"
              description="Entities are extracted automatically once your files have been indexed."
            />
          )}
          {entitiesQuery.data && entitiesQuery.data.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {entitiesQuery.data.map((entity) => (
                <Card
                  key={entity.id}
                  className="cursor-pointer hover:bg-accent/30 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-muted-foreground [&_svg]:size-4">
                          {entityTypeIcon[entity.type]}
                        </span>
                        <CardTitle className="truncate">{entity.name}</CardTitle>
                      </div>
                      <Badge variant={entityTypeBadge[entity.type]}>
                        {entity.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {entity.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {entity.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{entity.documentCount} documents</span>
                      <span>{entity.relationshipCount} relationships</span>
                      <span>{formatRelativeTime(entity.updatedAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="graph">
          <EmptyState
            icon={<Network />}
            title="Knowledge Graph"
            description="Interactive graph visualization is implemented in Phase 10 once the knowledge engine is connected."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
