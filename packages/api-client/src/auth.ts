// ─── Auth API ─────────────────────────────────────────────────────────────────
import type { LoginRequest, LoginResponse, User } from '@cognote/types'
import { apiGet, apiPost } from './client'
import { MOCK_LOGIN_RESPONSE, MOCK_USER } from './mocks/auth.mock'

const USE_MOCKS = true // MOCK — set via env config in Phase 7

export async function login(request: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCKS) {
    // MOCK — simulate network delay
    await delay(800)
    if (request.email === '' || request.password === '') {
      throw new Error('Email and password are required.')
    }
    return MOCK_LOGIN_RESPONSE
  }
  return apiPost<LoginResponse>('/api/v1/auth/login', request)
}

export async function logout(): Promise<void> {
  if (USE_MOCKS) {
    await delay(200)
    return
  }
  return apiPost<void>('/api/v1/auth/logout')
}

export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
  if (USE_MOCKS) {
    await delay(300)
    return MOCK_LOGIN_RESPONSE
  }
  return apiPost<LoginResponse>('/api/v1/auth/refresh', { refreshToken })
}

export async function getMe(): Promise<User> {
  if (USE_MOCKS) {
    await delay(200)
    return MOCK_USER
  }
  return apiGet<User>('/api/v1/auth/me')
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
