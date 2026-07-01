import { apiRequest, type ApiResponse } from './api'
import type { User } from '../types'

export interface AuthData {
  token: string
  tokenType: string
  user: User
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

function mapUser(raw: {
  id: number
  name: string
  email: string
  title?: string | null
  location?: string | null
  bio?: string | null
}): User {
  return {
    id: String(raw.id),
    name: raw.name,
    email: raw.email,
    title: raw.title ?? undefined,
    location: raw.location ?? undefined,
    bio: raw.bio ?? undefined,
  }
}

function mapAuthData(raw: {
  token: string
  tokenType: string
  user: {
    id: number
    name: string
    email: string
    title?: string | null
    location?: string | null
    bio?: string | null
  }
}): AuthData {
  return {
    token: raw.token,
    tokenType: raw.tokenType,
    user: mapUser(raw.user),
  }
}

export async function registerUser(payload: RegisterPayload): Promise<AuthData> {
  const response = await apiRequest<ApiResponse<{
    token: string
    tokenType: string
    user: { id: number; name: string; email: string; title?: string | null; location?: string | null; bio?: string | null }
  }>>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return mapAuthData(response.data)
}

export async function loginUser(payload: LoginPayload): Promise<AuthData> {
  const response = await apiRequest<ApiResponse<{
    token: string
    tokenType: string
    user: { id: number; name: string; email: string; title?: string | null; location?: string | null; bio?: string | null }
  }>>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return mapAuthData(response.data)
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await apiRequest<ApiResponse<{
    id: number
    name: string
    email: string
    title?: string | null
    location?: string | null
    bio?: string | null
  }>>('/api/users/me')

  return mapUser(response.data)
}

export async function updateUserProfile(data: Partial<User>): Promise<User> {
  const response = await apiRequest<ApiResponse<{
    id: number
    name: string
    email: string
    title?: string | null
    location?: string | null
    bio?: string | null
  }>>('/api/users/me', {
    method: 'PUT',
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      title: data.title,
      location: data.location,
      bio: data.bio,
    }),
  })

  return mapUser(response.data)
}

export async function deleteUserAccount(): Promise<void> {
  await apiRequest<ApiResponse<null>>('/api/users/me', {
    method: 'DELETE',
  })
}
