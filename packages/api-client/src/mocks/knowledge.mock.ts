// MOCK — wire to real /api/v1/knowledge endpoints in Phase 7
import type { KnowledgeEntity, KnowledgeStats } from '@cognote/types'

export const MOCK_KNOWLEDGE_STATS: KnowledgeStats = {
  documentCount: 2391,
  chunkCount: 14829,
  entityCount: 3204,
  relationshipCount: 817,
}

export const MOCK_ENTITIES: KnowledgeEntity[] = [
  {
    id: 'ent_001',
    organizationId: 'org_001',
    type: 'technology',
    name: 'OAuth 2.0',
    description: 'Standard authentication protocol used across all company services',
    ownerName: 'Platform Engineering',
    documentCount: 12,
    relationshipCount: 8,
    updatedAt: '2026-09-10T14:00:00Z',
  },
  {
    id: 'ent_002',
    organizationId: 'org_001',
    type: 'technology',
    name: 'PostgreSQL',
    description: 'Primary relational database for application state',
    ownerName: 'Architecture Team',
    documentCount: 9,
    relationshipCount: 14,
    updatedAt: '2026-09-09T09:00:00Z',
  },
  {
    id: 'ent_003',
    organizationId: 'org_001',
    type: 'project',
    name: 'Project Alpha',
    description: 'Q3 2026 flagship product initiative',
    ownerName: 'Product Team',
    documentCount: 34,
    relationshipCount: 22,
    updatedAt: '2026-09-12T08:00:00Z',
  },
  {
    id: 'ent_004',
    organizationId: 'org_001',
    type: 'decision',
    name: 'ADR-104: PostgreSQL over MongoDB',
    description: 'Architecture decision record for primary database selection',
    ownerName: 'Architecture Team',
    documentCount: 3,
    relationshipCount: 6,
    updatedAt: '2026-03-14T12:00:00Z',
  },
]
