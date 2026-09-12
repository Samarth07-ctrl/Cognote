// ─── Base HTTP Client ─────────────────────────────────────────────────────────
// All API calls go through this client. Never use fetch() directly in components.

import type { ApiError, ApiResponse } from '@cognote/types'

export interface ClientConfig {
  baseUrl: string
  getAccessToken: () => string | null
  onUnauthorized: () => void
}

let _config: ClientConfig = {
  baseUrl: 'http://localhost:8000',
  getAccessToken: () => null,
  onUnauthorized: () => {},
}

export function configureClient(config: Partial<ClientConfig>): void {
  _config = { ..._config, ...config }
}

export function getBaseUrl(): string {
  return _config.baseUrl
}

export class ApiRequestError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode?: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? ''

  if (!response.ok) {
    if (response.status === 401) {
      _config.onUnauthorized()
    }
    let errorBody: ApiError | undefined
    if (contentType.includes('application/json')) {
      try {
        errorBody = (await response.json()) as ApiError
      } catch {
        // ignore parse failure
      }
    }
    const code = errorBody?.error?.code ?? `HTTP_${response.status}`
    const message = errorBody?.error?.message ?? `Request failed with status ${response.status}`
    throw new ApiRequestError(code, message, response.status, errorBody?.error?.details)
  }

  if (!contentType.includes('application/json')) {
    return undefined as T
  }

  const body = (await response.json()) as ApiResponse<T>
  return body.data
}

function buildHeaders(extraHeaders?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  }
  const token = _config.getAccessToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  const url = new URL(`${_config.baseUrl}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  }
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: buildHeaders(),
  })
  return parseResponse<T>(response)
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${_config.baseUrl}${path}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  return parseResponse<T>(response)
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${_config.baseUrl}${path}`, {
    method: 'PATCH',
    headers: buildHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  return parseResponse<T>(response)
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await fetch(`${_config.baseUrl}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(),
  })
  return parseResponse<T>(response)
}
