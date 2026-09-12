// ─── API Client — Public Surface ──────────────────────────────────────────────
// Import from this package only. Never call fetch() directly in components.

export { configureClient } from './client'
export type { ClientConfig } from './client'
export { ApiRequestError } from './client'

export * as authApi from './auth'
export * as permissionsApi from './permissions'
export * as filesApi from './files'
export * as syncApi from './sync'
export * as searchApi from './search'
export * as chatApi from './chat'
export * as knowledgeApi from './knowledge'
export * as insightsApi from './insights'
export * as activityApi from './activity'
