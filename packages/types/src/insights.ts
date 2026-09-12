// ─── Insights Types ───────────────────────────────────────────────────────────

// ── Digital Waste ──────────────────────────────────────────────────────────

export type DuplicateClassification =
  | 'EXACT_DUPLICATE'
  | 'NEAR_DUPLICATE'
  | 'SEMANTIC_DUPLICATE'
  | 'VERSION'
  | 'RELATED'
  | 'NOT_DUPLICATE'

export interface WasteSummary {
  exactDuplicates: number
  nearDuplicates: number
  semanticDuplicates: number
  outdatedDocuments: number
  redundantKnowledge: number
  estimatedWasteBytes: number
  wasteLevel: 'low' | 'medium' | 'high'
}

export interface DuplicatePair {
  id: string
  documentA: DuplicateDocument
  documentB: DuplicateDocument
  similarityScore: number // 0–1
  classification: DuplicateClassification
  differences: string[]
  recommendation: string
  status: 'pending' | 'resolved' | 'ignored'
}

export interface DuplicateDocument {
  id: string
  title: string
  path: string
  updatedAt: string
}

// ── Decision Lineage ───────────────────────────────────────────────────────

export type DecisionStatus = 'proposed' | 'decided' | 'implemented' | 'superseded' | 'reverted'

export interface Decision {
  id: string
  organizationId: string
  title: string
  problem: string
  decision: string
  alternatives: string[]
  reasons: string[]
  participants: string[]
  date: string
  ownerId?: string
  ownerName?: string
  status: DecisionStatus
  confidence: 'high' | 'medium' | 'low'
  evidence: DecisionEvidence[]
  implementation?: string
  outcome?: string
  createdAt: string
}

export interface DecisionEvidence {
  documentId: string
  documentTitle: string
  excerpt: string
}

// ── Knowledge Health ───────────────────────────────────────────────────────

export interface KnowledgeHealthScore {
  overall: number // 0–100
  documentationQuality: number
  ownership: number
  versionConsistency: number
  decisionCompleteness: number
  duplicateRatio: number
  knowledgeDistribution: number
  conflictRate: number
}

export interface KnowledgeRisk {
  id: string
  type: KnowledgeRiskType
  severity: 'critical' | 'warning' | 'info'
  description: string
  entityId?: string
  entityName?: string
  count?: number
  createdAt: string
}

export type KnowledgeRiskType =
  | 'outdated_knowledge'
  | 'missing_ownership'
  | 'knowledge_concentration'
  | 'conflict'
  | 'missing_decision'
