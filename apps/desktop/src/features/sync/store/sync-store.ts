import { create } from 'zustand'
import type { SyncStatus } from '@cognote/types'

interface SyncStore {
  status: SyncStatus
  setStatus: (status: Partial<SyncStatus>) => void
}

const DEFAULT_STATUS: SyncStatus = {
  connectionStatus: 'connecting',
  lastSyncAt: null,
  isMonitoring: false,
  isPaused: false,
  counts: {
    processed: 0,
    processing: 0,
    queued: 0,
    failed: 0,
    ignored: 0,
    total: 0,
  },
}

export const useSyncStore = create<SyncStore>()((set) => ({
  status: DEFAULT_STATUS,
  setStatus: (partial) =>
    set((state) => ({ status: { ...state.status, ...partial } })),
}))
