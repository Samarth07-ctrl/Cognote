// ─── Permissions API ──────────────────────────────────────────────────────────
import type {
  FolderPermission,
  AddFolderRequest,
  UpdateFolderRequest,
  PermissionAuditEvent,
} from '@cognote/types'
import { apiGet, apiPost, apiPatch, apiDelete } from './client'
import { MOCK_FOLDERS, MOCK_AUDIT_EVENTS } from './mocks/permissions.mock'

const USE_MOCKS = true // MOCK — set via env config in Phase 7

let _mockFolders = [...MOCK_FOLDERS]

export async function getFolders(): Promise<FolderPermission[]> {
  if (USE_MOCKS) {
    await delay(300)
    return [..._mockFolders]
  }
  return apiGet<FolderPermission[]>('/api/v1/permissions')
}

export async function addFolder(request: AddFolderRequest): Promise<FolderPermission> {
  if (USE_MOCKS) {
    await delay(400)
    const newFolder: FolderPermission = {
      id: `fp_${Date.now()}`,
      userId: 'usr_001',
      path: request.path,
      displayName: request.displayName,
      permissionType: request.permissionType,
      monitoringEnabled: request.monitoringEnabled,
      fileCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    _mockFolders = [..._mockFolders, newFolder]
    return newFolder
  }
  return apiPost<FolderPermission>('/api/v1/permissions/folders', request)
}

export async function updateFolder(
  id: string,
  request: UpdateFolderRequest
): Promise<FolderPermission> {
  if (USE_MOCKS) {
    await delay(300)
    _mockFolders = _mockFolders.map((f) =>
      f.id === id ? { ...f, ...request, updatedAt: new Date().toISOString() } : f
    )
    const updated = _mockFolders.find((f) => f.id === id)
    if (!updated) throw new Error(`Folder ${id} not found`)
    return updated
  }
  return apiPatch<FolderPermission>(`/api/v1/permissions/folders/${id}`, request)
}

export async function removeFolder(id: string): Promise<void> {
  if (USE_MOCKS) {
    await delay(400)
    _mockFolders = _mockFolders.filter((f) => f.id !== id)
    return
  }
  return apiDelete<void>(`/api/v1/permissions/folders/${id}`)
}

export async function getAuditEvents(): Promise<PermissionAuditEvent[]> {
  if (USE_MOCKS) {
    await delay(300)
    return [...MOCK_AUDIT_EVENTS]
  }
  return apiGet<PermissionAuditEvent[]>('/api/v1/permissions/audit')
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
