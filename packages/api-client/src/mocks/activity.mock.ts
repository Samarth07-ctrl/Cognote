// MOCK — wire to real activity feed endpoint in Phase 7
import type { ActivityItem } from '@cognote/types'

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'act_001',
    type: 'file_indexed',
    title: 'Architecture Specification indexed',
    description: 'architecture-spec.pdf — 84 chunks, 27 entities',
    severity: 'success',
    createdAt: '2026-09-12T10:31:00Z',
  },
  {
    id: 'act_002',
    type: 'file_updated',
    title: 'Project Alpha documentation updated',
    description: 'project-alpha-overview.pptx — re-indexing in progress',
    severity: 'info',
    createdAt: '2026-09-12T10:28:00Z',
  },
  {
    id: 'act_003',
    type: 'duplicate_detected',
    title: '3 duplicate documents detected',
    description: 'API Architecture v3.pdf matches API Architecture Final.pdf (94% similarity)',
    severity: 'warning',
    createdAt: '2026-09-12T09:45:00Z',
  },
  {
    id: 'act_004',
    type: 'file_indexed',
    title: 'Database Decision Record indexed',
    description: 'database-decisions.docx — 32 chunks, 11 entities',
    severity: 'success',
    createdAt: '2026-09-12T09:30:00Z',
  },
  {
    id: 'act_005',
    type: 'knowledge_conflict',
    title: 'Knowledge conflict detected',
    description: 'Conflicting API timeout values found in 2 active documents',
    severity: 'warning',
    createdAt: '2026-09-11T16:20:00Z',
  },
]
