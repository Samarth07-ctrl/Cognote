// ─── Sync API ─────────────────────────────────────────────────────────────────
import type { SyncStatus } from '@cognote/types'
import { apiGet, apiPost } from './client'
import { MOCK_SYNC_STATUS } from './mocks/sync.mock'

const USE_MOCKS = true // MOCK — set via env config in Phase 7

export async function getSyncStatus(): Promise<SyncStatus> {
  if (USE_MOCKS) {
    await delay(300)
    return { ...MOCK_SYNC_STATUS }
  }
  return apiGet<SyncStatus>('/api/v1/sync/status')
}

export async function startSync(): Promise<void> {
  if (USE_MOCKS) {
    await delay(500)
    return
  }
  return apiPost<void>('/api/v1/sync/start')
}

export async function pauseSync(): Promise<void> {
  if (USE_MOCKS) {
    await delay(300)
    return
  }
  return apiPost<void>('/api/v1/sync/pause')
}

export async function resumeSync(): Promise<void> {
  if (USE_MOCKS) {
    await delay(300)
    return
  }
  return apiPost<void>('/api/v1/sync/resume')
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
