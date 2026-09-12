// ─── Sync Types ───────────────────────────────────────────────────────────────

export type SyncConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

export interface SyncStatus {
  connectionStatus: SyncConnectionStatus
  lastSyncAt: string | null
  isMonitoring: boolean
  isPaused: boolean
  counts: SyncCounts
}

export interface SyncCounts {
  processed: number
  processing: number
  queued: number
  failed: number
  ignored: number
  total: number
}

export interface SyncEvent {
  event: SyncEventType
  fileId?: string
  filePath?: string
  status?: string
  progress?: number
  message?: string
  timestamp: string
}

export type SyncEventType =
  | 'file_discovered'
  | 'file_queued'
  | 'file_processing'
  | 'file_processed'
  | 'file_indexed'
  | 'file_failed'
  | 'file_ignored'
  | 'sync_started'
  | 'sync_paused'
  | 'sync_resumed'
  | 'sync_completed'
  | 'folder_scan_progress'

export interface FolderScanProgress {
  folderId: string
  folderPath: string
  displayName: string
  progressPercent: number
  filesDiscovered: number
  filesSupported: number
  filesSkipped: number
  duplicatesDetected: number
}
