// ─── Chat / Ask Cognote Types ─────────────────────────────────────────────────

export type ChatMessageRole = 'user' | 'assistant' | 'system'

export type ChatResponseState =
  | 'idle'
  | 'generating'
  | 'retrieving'
  | 'answering'
  | 'done'
  | 'no_evidence'
  | 'conflict'
  | 'error'

export interface ChatMessage {
  id: string
  sessionId: string
  role: ChatMessageRole
  content: string
  citations?: Citation[]
  confidence?: ConfidenceLevel
  responseState?: ChatResponseState
  processingLocation?: string // e.g. "Company Server"
  sourcesUsed?: number
  createdAt: string
}

export interface Citation {
  id: string
  documentId: string
  documentTitle: string
  source: string
  section?: string
  pageNumber?: number
  excerpt: string
  date?: string
}

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'insufficient'

export interface ChatSession {
  id: string
  userId: string
  title: string
  messageCount: number
  createdAt: string
  updatedAt: string
}

export interface ChatRequest {
  sessionId?: string
  message: string
}

export interface ChatStreamChunk {
  type: 'token' | 'citation' | 'state_change' | 'done' | 'error'
  token?: string
  citation?: Citation
  state?: ChatResponseState
  error?: string
}
