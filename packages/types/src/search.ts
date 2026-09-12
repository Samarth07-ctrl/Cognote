// ─── Search Types ─────────────────────────────────────────────────────────────

export interface SearchRequest {
  query: string
  filters?: SearchFilters
  limit?: number
  offset?: number
}

export interface SearchFilters {
  source?: string[]
  team?: string[]
  department?: string[]
  person?: string[]
  project?: string[]
  dateFrom?: string
  dateTo?: string
  documentType?: string[]
  topic?: string[]
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  durationMs: number
}

export interface SearchResult {
  id: string
  documentId: string
  title: string
  source: string
  documentType: string
  ownerName?: string
  department?: string
  updatedAt: string
  excerpt: string
  relevanceScore: number // internal use only — do not display raw
  isAccessible: boolean
}
