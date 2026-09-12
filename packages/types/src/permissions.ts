// ─── Permission Types ─────────────────────────────────────────────────────────

export interface FolderPermission {
  id: string
  userId: string
  path: string
  displayName: string
  permissionType: FolderPermissionType
  monitoringEnabled: boolean
  fileCount?: number
  sizeBytes?: number
  createdAt: string
  updatedAt: string
}

export type FolderPermissionType = 'read' | 'read_write'

export interface AddFolderRequest {
  path: string
  displayName: string
  permissionType: FolderPermissionType
  monitoringEnabled: boolean
}

export interface UpdateFolderRequest {
  monitoringEnabled?: boolean
  permissionType?: FolderPermissionType
}

export interface PermissionAuditEvent {
  id: string
  userId: string
  action: PermissionAuditAction
  folderId?: string
  folderPath?: string
  detail: string
  createdAt: string
}

export type PermissionAuditAction =
  | 'folder_added'
  | 'folder_removed'
  | 'monitoring_enabled'
  | 'monitoring_disabled'
  | 'permission_changed'
