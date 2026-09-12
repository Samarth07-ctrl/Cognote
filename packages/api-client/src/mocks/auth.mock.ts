// MOCK — wire to real /api/v1/auth endpoints in Phase 7
import type { LoginResponse, User, Organization, AuthTokens } from '@cognote/types'

export const MOCK_USER: User = {
  id: 'usr_001',
  organizationId: 'org_001',
  name: 'John Smith',
  email: 'john.smith@acme.com',
  role: 'member',
  createdAt: '2026-01-15T09:00:00Z',
}

export const MOCK_ORGANIZATION: Organization = {
  id: 'org_001',
  name: 'Acme Corporation',
  settings: {
    allowExternalAI: false,
    defaultProcessingMode: 'automatic',
    defaultAILocation: 'company_server',
  },
  policies: {
    restrictedPaths: ['HR', 'Payroll', 'Legal', 'Executive'],
    allowedFileTypes: ['pdf', 'docx', 'pptx', 'xlsx', 'txt', 'md', 'png', 'jpg', 'jpeg'],
    maxFileSizeBytes: 104857600, // 100 MB
  },
  createdAt: '2025-06-01T00:00:00Z',
}

export const MOCK_TOKENS: AuthTokens = {
  accessToken: 'mock_access_token_abc123',
  refreshToken: 'mock_refresh_token_xyz789',
  expiresAt: '2026-12-31T23:59:59Z',
}

export const MOCK_LOGIN_RESPONSE: LoginResponse = {
  user: MOCK_USER,
  organization: MOCK_ORGANIZATION,
  tokens: MOCK_TOKENS,
}
