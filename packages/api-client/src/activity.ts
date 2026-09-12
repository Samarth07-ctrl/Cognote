// ─── Activity API ─────────────────────────────────────────────────────────────
import type { ActivityItem } from '@cognote/types'
import { apiGet } from './client'
import { MOCK_ACTIVITY } from './mocks/activity.mock'

const USE_MOCKS = true // MOCK — set via env config in Phase 7

export async function getRecentActivity(limit = 10): Promise<ActivityItem[]> {
  if (USE_MOCKS) {
    await delay(300)
    return MOCK_ACTIVITY.slice(0, limit)
  }
  return apiGet<ActivityItem[]>('/api/v1/activity', { limit })
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
