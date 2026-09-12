// ─── File & Document Types ────────────────────────────────────────────────────

export type FileProcessingStatus =
  | 'DISCOVERED'
  | 'QUEUED'
  | 'PROCESSING'
  | 'PROCESSED'
  | 'INDEXED'
  | 'FAILED'
  | 'IGNORED'

export type FileIgnoreReason =
  | 'unsupported_type'
  | 'permission_denied'
  | 'excluded_by_policy'
  | 'corrupted'
  | 'duplicate'
  | 'too_large'
  | 'encrypted'
  | 'user_ignored'

export interface DiscoveredFile {
  id: string
  organizationId: string
  folderId: string
  name: string
  path: string
  extension: string
  mimeType: string
  sizeBytes: number
  hash: string // SHA-256
  status: FileProcessingStatus
  ignoreReason?: FileIgnoreReason
  failureReason?: string
  chunkCount?: number
  entityCount?: number
  ownerId?: string
  lastProcessedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: string
  organizationId: string
  sourceType: DocumentSourceType
  title: string
  path: string
  mimeType: string
  sizeBytes: number
  hash: string
  ownerId?: string
  ownerName?: string
  department?: string
  team?: string
  project?: string
  status: FileProcessingStatus
  chunkCount: number
  entityCount: number
  indexedAt?: string
  createdAt: string
  updatedAt: string
}

export type DocumentSourceType =
  | 'local_file'
  | 'google_drive'
  | 'onedrive'
  | 'sharepoint'
  | 'github'
  | 'confluence'
  | 'notion'
  | 'slack'

export interface DocumentChunk {
  id: string
  documentId: string
  chunkIndex: number
  content: string
  embeddingId?: string
}

export interface RegisterFileRequest {
  folderId: string
  path: string
  name: string
  mimeType: string
  sizeBytes: number
  hash: string
}

export interface FileSyncRequest {
  fileId: string
  newHash?: string
}
