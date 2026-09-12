// ─── Common / Shared Types ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  success: true
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export type ApiResult<T> = ApiResponse<T> | ApiError

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description?: string
  icon?: string
  severity?: 'info' | 'warning' | 'error' | 'success'
  createdAt: string
}

export type ActivityType =
  | 'file_indexed'
  | 'file_updated'
  | 'duplicate_detected'
  | 'sync_completed'
  | 'permission_changed'
  | 'knowledge_conflict'
  | 'decision_extracted'

export type OnboardingStep =
  | 'welcome'
  | 'sign_in'
  | 'storage_permission'
  | 'folder_confirmation'
  | 'processing_preference'
  | 'ai_location'
  | 'privacy_confirmation'
  | 'initial_scan'
  | 'complete'
