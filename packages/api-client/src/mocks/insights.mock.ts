// MOCK — wire to real /api/v1/insights endpoints in Phase 7
import type { WasteSummary, Decision, KnowledgeHealthScore, KnowledgeRisk } from '@cognote/types'

export const MOCK_WASTE_SUMMARY: WasteSummary = {
  exactDuplicates: 142,
  nearDuplicates: 67,
  semanticDuplicates: 31,
  outdatedDocuments: 49,
  redundantKnowledge: 22,
  estimatedWasteBytes: 1_932_735_283, // ~1.8 GB
  wasteLevel: 'high',
}

export const MOCK_DECISIONS: Decision[] = [
  {
    id: 'dec_001',
    organizationId: 'org_001',
    title: 'Use PostgreSQL as primary database',
    problem: 'Need a reliable transactional database to support the application state layer.',
    decision: 'PostgreSQL',
    alternatives: ['PostgreSQL', 'MongoDB', 'DynamoDB'],
    reasons: [
      'Strong transaction support (ACID)',
      'Existing engineering team expertise',
      'Ecosystem compatibility with existing tooling',
    ],
    participants: ['Architecture Team', 'Platform Engineering', 'CTO'],
    date: '2026-03-14T12:00:00Z',
    ownerName: 'Architecture Team',
    status: 'implemented',
    confidence: 'high',
    evidence: [
      {
        documentId: 'doc_002',
        documentTitle: 'Database Decision Record',
        excerpt: 'PostgreSQL was selected over MongoDB due to ACID compliance requirements...',
      },
    ],
    implementation: 'GitHub PR #481 — Database layer migration',
    outcome: 'Stable production operation since April 2026',
    createdAt: '2026-03-14T12:00:00Z',
  },
]

export const MOCK_HEALTH_SCORE: KnowledgeHealthScore = {
  overall: 82,
  documentationQuality: 84,
  ownership: 80,
  versionConsistency: 81,
  decisionCompleteness: 72,
  duplicateRatio: 91,
  knowledgeDistribution: 63,
  conflictRate: 76,
}

export const MOCK_KNOWLEDGE_RISKS: KnowledgeRisk[] = [
  {
    id: 'risk_001',
    type: 'outdated_knowledge',
    severity: 'warning',
    description: '12 outdated documents — last modified more than 18 months ago.',
    count: 12,
    createdAt: '2026-09-12T06:00:00Z',
  },
  {
    id: 'risk_002',
    type: 'missing_ownership',
    severity: 'warning',
    description: '8 documents have no assigned owner.',
    count: 8,
    createdAt: '2026-09-12T06:00:00Z',
  },
  {
    id: 'risk_003',
    type: 'knowledge_concentration',
    severity: 'critical',
    description: 'Critical knowledge about Authentication Service is concentrated in 1 employee.',
    entityName: 'Authentication Service',
    count: 1,
    createdAt: '2026-09-12T06:00:00Z',
  },
  {
    id: 'risk_004',
    type: 'conflict',
    severity: 'warning',
    description: '4 conflicting specifications detected across active documents.',
    count: 4,
    createdAt: '2026-09-12T06:00:00Z',
  },
  {
    id: 'risk_005',
    type: 'missing_decision',
    severity: 'warning',
    description: '3 unresolved decisions with no documented outcome.',
    count: 3,
    createdAt: '2026-09-12T06:00:00Z',
  },
]
