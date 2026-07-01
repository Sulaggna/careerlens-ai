const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export class ApiError extends Error {
  status: number
  errors?: Record<string, string>

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

export interface ErrorResponse {
  success: boolean
  message: string
  status: number
  errors?: Record<string, string>
  timestamp: string
}

function getAuthToken(): string | null {
  return localStorage.getItem('token')
}

export function setAuthToken(token: string): void {
  localStorage.setItem('token', token)
}

export function clearAuthToken(): void {
  localStorage.removeItem('token')
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')
  const body = isJson ? await response.json() : null

  if (!response.ok) {
    const errorBody = body as ErrorResponse | null
    throw new ApiError(
      errorBody?.message || `Request failed with status ${response.status}`,
      response.status,
      errorBody?.errors,
    )
  }

  return body as T
}

export { API_BASE_URL }
