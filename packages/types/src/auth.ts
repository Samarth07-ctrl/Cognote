// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface User {
  id: string
  organizationId: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
  createdAt: string
}

export type UserRole = 'admin' | 'member' | 'viewer'

export interface Organization {
  id: string
  name: string
  logoUrl?: string
  settings: OrganizationSettings
  policies: OrganizationPolicies
  createdAt: string
}

export interface OrganizationSettings {
  allowExternalAI: boolean
  defaultProcessingMode: ProcessingMode
  defaultAILocation: AIProcessingLocation
}

export interface OrganizationPolicies {
  restrictedPaths: string[]
  allowedFileTypes: string[]
  maxFileSizeBytes: number
}

export type ProcessingMode = 'manual' | 'automatic' | 'ask'

export type AIProcessingLocation = 'company_server' | 'local' | 'external'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  organization: Organization
  tokens: AuthTokens
}

export interface AuthState {
  user: User | null
  organization: Organization | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
}
