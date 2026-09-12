// MOCK — wire to real /api/v1/permissions endpoints in Phase 7
import type { FolderPermission, PermissionAuditEvent } from '@cognote/types'

export const MOCK_FOLDERS: FolderPermission[] = [
  {
    id: 'fp_001',
    userId: 'usr_001',
    path: 'C:\\Company\\Engineering',
    displayName: 'Engineering',
    permissionType: 'read',
    monitoringEnabled: true,
    fileCount: 1842,
    sizeBytes: 3_221_225_472,
    createdAt: '2026-09-08T10:00:00Z',
    updatedAt: '2026-09-12T08:30:00Z',
  },
  {
    id: 'fp_002',
    userId: 'usr_001',
    path: 'C:\\Company\\Projects',
    displayName: 'Projects',
    permissionType: 'read',
    monitoringEnabled: true,
    fileCount: 394,
    sizeBytes: 524_288_000,
    createdAt: '2026-09-08T10:01:00Z',
    updatedAt: '2026-09-12T08:30:00Z',
  },
  {
    id: 'fp_003',
    userId: 'usr_001',
    path: 'C:\\Company\\Documentation',
    displayName: 'Documentation',
    permissionType: 'read',
    monitoringEnabled: true,
    fileCount: 155,
    sizeBytes: 157_286_400,
    createdAt: '2026-09-08T10:02:00Z',
    updatedAt: '2026-09-12T08:30:00Z',
  },
]

export const MOCK_AUDIT_EVENTS: PermissionAuditEvent[] = [
  {
    id: 'ae_001',
    userId: 'usr_001',
    action: 'folder_added',
    folderId: 'fp_001',
    folderPath: 'C:\\Company\\Engineering',
    detail: 'John added: Engineering/',
    createdAt: '2026-09-12T10:15:00Z',
  },
  {
    id: 'ae_002',
    userId: 'usr_001',
    action: 'folder_removed',
    folderPath: 'C:\\Users\\John\\Downloads',
    detail: 'John removed: Downloads/',
    createdAt: '2026-09-10T14:22:00Z',
  },
  {
    id: 'ae_003',
    userId: 'usr_001',
    action: 'monitoring_enabled',
    folderId: 'fp_003',
    folderPath: 'C:\\Company\\Documentation',
    detail: 'Admin enabled monitoring for Documentation/',
    createdAt: '2026-09-08T09:00:00Z',
  },
]
