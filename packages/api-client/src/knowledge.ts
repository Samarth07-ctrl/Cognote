// ─── Knowledge API ────────────────────────────────────────────────────────────
import type { KnowledgeEntity, KnowledgeRelationship, KnowledgeStats } from '@cognote/types'
import { apiGet } from './client'
import { MOCK_ENTITIES, MOCK_KNOWLEDGE_STATS } from './mocks/knowledge.mock'

const USE_MOCKS = true // MOCK — set via env config in Phase 7

export async function getKnowledgeStats(): Promise<KnowledgeStats> {
  if (USE_MOCKS) {
    await delay(300)
    return { ...MOCK_KNOWLEDGE_STATS }
  }
  return apiGet<KnowledgeStats>('/api/v1/knowledge/stats')
}

export async function getEntities(): Promise<KnowledgeEntity[]> {
  if (USE_MOCKS) {
    await delay(400)
    return [...MOCK_ENTITIES]
  }
  return apiGet<KnowledgeEntity[]>('/api/v1/knowledge/entities')
}

export async function getEntity(id: string): Promise<KnowledgeEntity> {
  if (USE_MOCKS) {
    await delay(200)
    const entity = MOCK_ENTITIES.find((e) => e.id === id)
    if (!entity) throw new Error(`Entity ${id} not found`)
    return entity
  }
  return apiGet<KnowledgeEntity>(`/api/v1/knowledge/entities/${id}`)
}

export async function getEntityRelationships(id: string): Promise<KnowledgeRelationship[]> {
  if (USE_MOCKS) {
    await delay(300)
    // MOCK — return empty relationships until knowledge graph is wired
    return []
  }
  return apiGet<KnowledgeRelationship[]>(`/api/v1/knowledge/entities/${id}/relationships`)
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
