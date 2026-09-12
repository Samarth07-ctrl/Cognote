// ─── Insights API ─────────────────────────────────────────────────────────────
import type { WasteSummary, Decision, KnowledgeHealthScore, KnowledgeRisk } from '@cognote/types'
import { apiGet } from './client'
import {
  MOCK_WASTE_SUMMARY,
  MOCK_DECISIONS,
  MOCK_HEALTH_SCORE,
  MOCK_KNOWLEDGE_RISKS,
} from './mocks/insights.mock'

const USE_MOCKS = true // MOCK — set via env config in Phase 7

export async function getWasteSummary(): Promise<WasteSummary> {
  if (USE_MOCKS) {
    await delay(400)
    return { ...MOCK_WASTE_SUMMARY }
  }
  return apiGet<WasteSummary>('/api/v1/insights/waste')
}

export async function getDecisions(): Promise<Decision[]> {
  if (USE_MOCKS) {
    await delay(400)
    return [...MOCK_DECISIONS]
  }
  return apiGet<Decision[]>('/api/v1/insights/decisions')
}

export async function getDecision(id: string): Promise<Decision> {
  if (USE_MOCKS) {
    await delay(200)
    const decision = MOCK_DECISIONS.find((d) => d.id === id)
    if (!decision) throw new Error(`Decision ${id} not found`)
    return decision
  }
  return apiGet<Decision>(`/api/v1/insights/decisions/${id}`)
}

export async function getKnowledgeHealthScore(): Promise<KnowledgeHealthScore> {
  if (USE_MOCKS) {
    await delay(400)
    return { ...MOCK_HEALTH_SCORE }
  }
  return apiGet<KnowledgeHealthScore>('/api/v1/insights/health')
}

export async function getKnowledgeRisks(): Promise<KnowledgeRisk[]> {
  if (USE_MOCKS) {
    await delay(300)
    return [...MOCK_KNOWLEDGE_RISKS]
  }
  return apiGet<KnowledgeRisk[]>('/api/v1/insights/health/risks')
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
