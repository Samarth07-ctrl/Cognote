// MOCK — wire to real /api/v1/chat endpoints in Phase 7
import type { ChatSession, ChatMessage, ChatStreamChunk } from '@cognote/types'

export const MOCK_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'sess_001',
    userId: 'usr_001',
    title: 'Authentication architecture questions',
    messageCount: 4,
    createdAt: '2026-09-12T09:00:00Z',
    updatedAt: '2026-09-12T09:15:00Z',
  },
  {
    id: 'sess_002',
    userId: 'usr_001',
    title: 'Why PostgreSQL over MongoDB?',
    messageCount: 2,
    createdAt: '2026-09-11T14:30:00Z',
    updatedAt: '2026-09-11T14:38:00Z',
  },
]

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_001',
    sessionId: 'sess_001',
    role: 'user',
    content: 'What is our current authentication architecture?',
    createdAt: '2026-09-12T09:00:00Z',
  },
  {
    id: 'msg_002',
    sessionId: 'sess_001',
    role: 'assistant',
    content:
      'The organization uses **OAuth 2.0** as the standard authentication mechanism across all internal services and external-facing APIs.\n\nKey aspects of the current architecture:\n\n1. **Token-based authentication** — Bearer tokens with a 3600-second expiry\n2. **Centralized OAuth provider** — All services delegate to the company OAuth 2.0 provider\n3. **Role-based access control** — Enforced at the API gateway layer\n\nThis decision was made during the Architecture Review in March 2026, prioritizing security, ecosystem compatibility, and existing team expertise.',
    citations: [
      {
        id: 'cit_001',
        documentId: 'doc_001',
        documentTitle: 'Architecture Specification',
        source: 'Engineering / Architecture',
        section: 'Section 4 — Authentication',
        excerpt: 'OAuth 2.0 is used as the organization\'s standard authentication mechanism...',
        date: '2026-09-10T14:00:00Z',
      },
      {
        id: 'cit_002',
        documentId: 'doc_003',
        documentTitle: 'API Gateway Configuration Guide',
        source: 'Engineering / Infrastructure',
        excerpt: 'All API endpoints require Bearer token authentication via the company OAuth 2.0 provider...',
        date: '2026-08-20T11:00:00Z',
      },
    ],
    confidence: 'high',
    responseState: 'done',
    processingLocation: 'Company Server',
    sourcesUsed: 3,
    createdAt: '2026-09-12T09:00:12Z',
  },
]

// Simulated streaming chunks for the mock streaming response
export const MOCK_STREAM_CHUNKS: ChatStreamChunk[] = [
  { type: 'state_change', state: 'retrieving' },
  { type: 'state_change', state: 'answering' },
  { type: 'token', token: 'The organization uses ' },
  { type: 'token', token: '**OAuth 2.0**' },
  { type: 'token', token: ' as the standard authentication mechanism.' },
  {
    type: 'citation',
    citation: {
      id: 'cit_001',
      documentId: 'doc_001',
      documentTitle: 'Architecture Specification',
      source: 'Engineering / Architecture',
      section: 'Section 4 — Authentication',
      excerpt: 'OAuth 2.0 is the standard authentication mechanism...',
      date: '2026-09-10T14:00:00Z',
    },
  },
  { type: 'done' },
]
