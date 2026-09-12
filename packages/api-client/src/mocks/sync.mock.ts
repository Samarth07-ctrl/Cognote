// MOCK — wire to real /api/v1/sync endpoints in Phase 7
import type { SyncStatus, FolderScanProgress } from '@cognote/types'

export const MOCK_SYNC_STATUS: SyncStatus = {
  connectionStatus: 'connected',
  lastSyncAt: '2026-09-12T10:30:00Z',
  isMonitoring: true,
  isPaused: false,
  counts: {
    processed: 2391,
    processing: 12,
    queued: 8,
    failed: 3,
    ignored: 91,
    total: 2505,
  },
}

export const MOCK_SCAN_PROGRESS: FolderScanProgress[] = [
  {
    folderId: 'fp_001',
    folderPath: 'C:\\Company\\Engineering',
    displayName: 'Engineering',
    progressPercent: 80,
    filesDiscovered: 2482,
    filesSupported: 2391,
    filesSkipped: 91,
    duplicatesDetected: 142,
  },
  {
    folderId: 'fp_002',
    folderPath: 'C:\\Company\\Projects',
    displayName: 'Projects',
    progressPercent: 100,
    filesDiscovered: 394,
    filesSupported: 394,
    filesSkipped: 0,
    duplicatesDetected: 12,
  },
]
