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
    await delay(300)
    for (const chunk of MOCK_STREAM_CHUNKS) {
      await delay(chunk.type === 'token' ? 60 : 200)
      yield chunk
    }
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
