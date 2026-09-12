// ─── Chat API ─────────────────────────────────────────────────────────────────
import type { ChatSession, ChatMessage, ChatRequest, ChatStreamChunk } from '@cognote/types'
import { apiGet, apiPost } from './client'
import {
  MOCK_CHAT_SESSIONS,
  MOCK_CHAT_MESSAGES,
  MOCK_STREAM_CHUNKS,
} from './mocks/chat.mock'

const USE_MOCKS = true // MOCK — set via env config in Phase 7

export async function getChatSessions(): Promise<ChatSession[]> {
  if (USE_MOCKS) {
    await delay(300)
    return [...MOCK_CHAT_SESSIONS]
  }
  return apiGet<ChatSession[]>('/api/v1/chat/sessions')
}

export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  if (USE_MOCKS) {
    await delay(400)
    return MOCK_CHAT_MESSAGES.filter((m) => m.sessionId === sessionId)
  }
  return apiGet<ChatMessage[]>(`/api/v1/chat/sessions/${sessionId}`)
}

export async function sendMessage(request: ChatRequest): Promise<ChatMessage> {
  if (USE_MOCKS) {
    await delay(1200)
    return MOCK_CHAT_MESSAGES[1] as ChatMessage
  }
  return apiPost<ChatMessage>('/api/v1/chat', request)
}

/**
 * Mock streaming implementation.
 * Yields ChatStreamChunk objects with artificial delays to simulate real streaming.
 * MOCK — replace with real SSE/WebSocket streaming in Phase 9.
 */
export async function* streamMessage(
  request: ChatRequest
): AsyncGenerator<ChatStreamChunk, void, unknown> {
  if (USE_MOCKS) {
    const q = request.message.toLowerCase()
    await delay(200)

    if (q.includes('conflict') || q.includes('discrepancy')) {
      yield { type: 'state_change', state: 'retrieving' }
      await delay(300)
      yield { type: 'state_change', state: 'conflict' }
      await delay(250)
      yield { type: 'token', token: 'Potential conflicting specifications detected between Architecture Spec (v2) and API Gateway Guide regarding token expiry durations (3600s vs 7200s).' }
      yield {
        type: 'citation',
        citation: {
          id: 'cit_001',
          documentId: 'doc_001',
          documentTitle: 'Architecture Specification',
          source: 'Engineering / Architecture',
          section: 'Section 4 — Authentication',
          excerpt: 'Tokens expire after 3600 seconds...',
        },
      }
      yield { type: 'done' }
      return
    }

    if (q.includes('auth') || q.includes('oauth') || q.includes('login') || q.includes('architecture')) {
      yield { type: 'state_change', state: 'retrieving' }
      await delay(200)
      yield { type: 'state_change', state: 'answering' }
      for (const chunk of MOCK_STREAM_CHUNKS) {
        if (chunk.type === 'state_change') continue
        await delay(chunk.type === 'token' ? 40 : 150)
        yield chunk
      }
      return
    }

    if (q.includes('postgres') || q.includes('database') || q.includes('sql')) {
      yield { type: 'state_change', state: 'retrieving' }
      await delay(250)
      yield { type: 'state_change', state: 'answering' }
      const text = 'PostgreSQL was chosen for its robust ACID compliance, proven JSONB capabilities for semi-structured data, and strong role-based access control matching enterprise security standards.'
      for (const word of text.split(' ')) {
        await delay(35)
        yield { type: 'token', token: word + ' ' }
      }
      yield {
        type: 'citation',
        citation: {
          id: 'cit_002',
          documentId: 'doc_002',
          documentTitle: 'Database Decision Record — PostgreSQL',
          source: 'Engineering / Architecture',
          section: 'Section 2 — Selection Rationale',
          excerpt: 'PostgreSQL evaluated against MongoDB and DynamoDB...',
        },
      }
      yield { type: 'done' }
      return
    }

    // Default for unmatched/unknown queries: NO EVIDENCE state
    yield { type: 'state_change', state: 'retrieving' }
    await delay(300)
    yield { type: 'state_change', state: 'no_evidence' }
    await delay(200)
    yield {
      type: 'token',
      token: 'No verified evidence or documentation found in authorized folders to answer this question. Please ensure the relevant folders are authorized in the Permissions tab or rephrase your question.',
    }
    yield { type: 'done' }
    return
  }

  const response = await fetch('/api/v1/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok || !response.body) {
    throw new Error('Stream request failed')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value, { stream: true })
    const lines = text.split('\n').filter((l) => l.startsWith('data: '))
    for (const line of lines) {
      const json = line.slice(6)
      if (json === '[DONE]') return
      yield JSON.parse(json) as ChatStreamChunk
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
