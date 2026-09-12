// ─── Files API ────────────────────────────────────────────────────────────────
import type { DiscoveredFile, Document, RegisterFileRequest } from '@cognote/types'
import { apiGet, apiPost } from './client'
import { MOCK_FILES, MOCK_DOCUMENTS } from './mocks/files.mock'

const USE_MOCKS = true // MOCK — set via env config in Phase 7

export async function getFiles(folderId?: string): Promise<DiscoveredFile[]> {
  if (USE_MOCKS) {
    await delay(400)
    if (folderId) {
      return MOCK_FILES.filter((f) => f.folderId === folderId)
    }
    return [...MOCK_FILES]
  }
  return apiGet<DiscoveredFile[]>('/api/v1/files', folderId ? { folderId } : undefined)
}

export async function getFile(id: string): Promise<DiscoveredFile> {
  if (USE_MOCKS) {
    await delay(200)
    const file = MOCK_FILES.find((f) => f.id === id)
    if (!file) throw new Error(`File ${id} not found`)
    return file
  }
  return apiGet<DiscoveredFile>(`/api/v1/files/${id}`)
}

export async function getDocuments(): Promise<Document[]> {
  if (USE_MOCKS) {
    await delay(400)
    return [...MOCK_DOCUMENTS]
  }
  return apiGet<Document[]>('/api/v1/documents')
}

export async function getDocument(id: string): Promise<Document> {
  if (USE_MOCKS) {
    await delay(200)
    const doc = MOCK_DOCUMENTS.find((d) => d.id === id)
    if (!doc) throw new Error(`Document ${id} not found`)
    return doc
  }
  return apiGet<Document>(`/api/v1/documents/${id}`)
}

export async function registerFile(request: RegisterFileRequest): Promise<DiscoveredFile> {
  if (USE_MOCKS) {
    await delay(300)
    const newFile: DiscoveredFile = {
      id: `file_${Date.now()}`,
      organizationId: 'org_001',
      folderId: request.folderId,
      name: request.name,
      path: request.path,
      extension: request.name.split('.').pop() ?? '',
      mimeType: request.mimeType,
      sizeBytes: request.sizeBytes,
      hash: request.hash,
      status: 'QUEUED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newFile
  }
  return apiPost<DiscoveredFile>('/api/v1/files/register', request)
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
