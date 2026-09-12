import type { SearchRequest, SearchResponse, SearchResult } from '@cognote/types'
import { apiPost } from './client'
import { MOCK_SEARCH_RESPONSE } from './mocks/search.mock'

const USE_MOCKS = true // MOCK — set via env config in Phase 7

export async function search(request: SearchRequest): Promise<SearchResponse> {
  if (USE_MOCKS) {
    const startTime = performance.now()
    await delay(250) // simulate realistic local search latency

    const q = request.query.trim().toLowerCase()
    if (!q) {
      return {
        query: request.query,
        total: 0,
        durationMs: Math.round(performance.now() - startTime),
        results: [],
      }
    }

    const filtered = MOCK_SEARCH_RESPONSE.results.filter(
      (r: SearchResult) =>
        r.title.toLowerCase().includes(q) ||
        r.excerpt.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        r.documentType.toLowerCase().includes(q)
    )

    const elapsed = Math.round(performance.now() - startTime)
    return {
      query: request.query,
      total: filtered.length,
      durationMs: elapsed,
      results: filtered,
    }
  }
  return apiPost<SearchResponse>('/api/v1/search', request)
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
