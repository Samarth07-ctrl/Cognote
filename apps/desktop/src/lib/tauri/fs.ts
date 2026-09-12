// ─── Tauri Filesystem Helpers ─────────────────────────────────────────────────
// All Tauri invoke() calls are wrapped here.
// Components NEVER call invoke() directly.

import { invoke } from '@tauri-apps/api/core'

export interface PickedFolder {
  path: string
  displayName: string
}

export interface FileEntry {
  path: string
  name: string
  extension: string
  sizeBytes: number
  modifiedAt: string | null
  isSupported: boolean
}

/**
 * Opens the native OS folder picker.
 * Returns null if the user cancelled.
 */
export async function pickFolder(): Promise<PickedFolder | null> {
  const result = await invoke<{ path: string; display_name: string } | null>('pick_folder')
  if (!result) return null
  return { path: result.path, displayName: result.display_name }
}

/**
 * Computes SHA-256 hash of a file on disk.
 * Only works for files inside authorized folders.
 */
export async function hashFile(path: string): Promise<string> {
  return invoke<string>('hash_file', { path })
}

/**
 * Recursively reads a directory and returns file metadata.
 * Only authorized folder paths should be passed here.
 */
export async function readDirRecursive(
  folderPath: string,
  maxDepth?: number
): Promise<FileEntry[]> {
  const results = await invoke<
    {
      path: string
      name: string
      extension: string
      size_bytes: number
      modified_at: string | null
      is_supported: boolean
    }[]
  >('read_dir_recursive', { folder_path: folderPath, max_depth: maxDepth })

  return results.map((r) => ({
    path: r.path,
    name: r.name,
    extension: r.extension,
    sizeBytes: r.size_bytes,
    modifiedAt: r.modified_at,
    isSupported: r.is_supported,
  }))
}
