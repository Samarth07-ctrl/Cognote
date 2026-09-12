// MOCK — wire to real /api/v1/search endpoint in Phase 7
import type { SearchResponse } from '@cognote/types'

export const MOCK_SEARCH_RESPONSE: SearchResponse = {
  query: 'authentication architecture',
  total: 4,
  durationMs: 187,
  results: [
    {
      id: 'sr_001',
      documentId: 'doc_001',
      title: 'Authentication Architecture',
      source: 'Engineering / Architecture',
      documentType: 'PDF',
      ownerName: 'Platform Engineering',
      department: 'Engineering',
      updatedAt: '2026-09-10T14:00:00Z',
      excerpt:
        'OAuth 2.0 is used as the organization\'s standard authentication mechanism across all internal services and external-facing APIs...',
      relevanceScore: 0.97,
      isAccessible: true,
    },
    {
      id: 'sr_002',
      documentId: 'doc_002',
      title: 'Database Decision Record — PostgreSQL',
      source: 'Engineering / Architecture',
      documentType: 'DOCX',
      ownerName: 'Architecture Team',
      department: 'Engineering',
      updatedAt: '2026-09-09T09:00:00Z',
      excerpt:
        'The authentication strategy was reviewed as part of the database selection process. PostgreSQL\'s role-based access control was a key factor...',
      relevanceScore: 0.82,
      isAccessible: true,
    },
    {
      id: 'sr_003',
      documentId: 'doc_003',
      title: 'API Gateway Configuration Guide',
      source: 'Engineering / Infrastructure',
      documentType: 'MD',
      ownerName: 'Infrastructure Team',
      department: 'Engineering',
      updatedAt: '2026-08-20T11:00:00Z',
      excerpt:
        'All API endpoints require Bearer token authentication via the company OAuth 2.0 provider. Tokens expire after 3600 seconds...',
      relevanceScore: 0.74,
      isAccessible: true,
    },
    {
      id: 'sr_004',
      documentId: 'doc_004',
      title: 'Security Review — Q2 2026',
      source: 'Engineering / Security',
      documentType: 'DOCX',
      ownerName: 'Security Team',
      department: 'Engineering',
      updatedAt: '2026-07-01T08:00:00Z',
      excerpt:
        'Authentication flows were reviewed and found compliant. No critical vulnerabilities detected in the OAuth implementation...',
      relevanceScore: 0.68,
      isAccessible: true,
    },
  ],
}

export const MOCK_EMPTY_SEARCH_RESPONSE: SearchResponse = {
  query: '',
  total: 0,
  durationMs: 12,
  results: [],
}
