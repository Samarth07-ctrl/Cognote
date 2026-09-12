// ─── Search API ───────────────────────────────────────────────────────────────
import type { SearchRequest, SearchResponse } from '@cognote/types'
import { apiPost } from './client'
import { MOCK_SEARCH_RESPONSE, MOCK_EMPTY_SEARCH_RESPONSE } from './mocks/search.mock'

const USE_MOCKS = true // MOCK — set via env config in Phase 7

export async function search(request: SearchRequest): Promise<SearchResponse> {
  if (USE_MOCKS) {
    await delay(600)
    if (!request.query.trim()) {
      return { ...MOCK_EMPTY_SEARCH_RESPONSE, query: request.query }
    }
    return { ...MOCK_SEARCH_RESPONSE, query: request.query }
  }
  return apiPost<SearchResponse>('/api/v1/search', request)
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
