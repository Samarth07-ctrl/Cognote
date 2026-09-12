// ─── Knowledge Graph Types ────────────────────────────────────────────────────

export type EntityType =
  | 'document'
  | 'person'
  | 'team'
  | 'project'
  | 'decision'
  | 'meeting'
  | 'technology'
  | 'repository'
  | 'service'
  | 'topic'

export type RelationshipType =
  | 'AUTHORED_BY'
  | 'BELONGS_TO'
  | 'MENTIONS'
  | 'RELATED_TO'
  | 'DECIDED_IN'
  | 'IMPLEMENTS'
  | 'DEPENDS_ON'
  | 'SUPERSEDES'
  | 'CONFLICTS_WITH'

export interface KnowledgeEntity {
  id: string
  organizationId: string
  type: EntityType
  name: string
  description?: string
  ownerId?: string
  ownerName?: string
  documentCount: number
  relationshipCount: number
  updatedAt: string
}

export interface KnowledgeRelationship {
  id: string
  sourceEntityId: string
  targetEntityId: string
  sourceEntity?: KnowledgeEntity
  targetEntity?: KnowledgeEntity
  relationshipType: RelationshipType
  confidence: number
}

export interface KnowledgeStats {
  documentCount: number
  chunkCount: number
  entityCount: number
  relationshipCount: number
}
