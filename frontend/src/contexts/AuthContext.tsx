import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '../types'
import {
  loginUser,
  registerUser,
  fetchCurrentUser,
  updateUserProfile,
  deleteUserAccount,
} from '../services/authService'
import { ApiError, clearAuthToken, setAuthToken } from '../services/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function persistSession(user: User, token: string) {
  setAuthToken(token)
  localStorage.setItem('user', JSON.stringify(user))
}

function clearSession() {
  clearAuthToken()
  localStorage.removeItem('user')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsLoading(false)
      return
    }

    fetchCurrentUser()
      .then((currentUser) => {
        setUser(currentUser)
        localStorage.setItem('user', JSON.stringify(currentUser))
      })
      .catch(() => {
        clearSession()
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const authData = await loginUser({ email, password })
    setUser(authData.user)
    persistSession(authData.user, authData.token)
  }

  const register = async (name: string, email: string, password: string) => {
    const authData = await registerUser({ name, email, password })
    setUser(authData.user)
    persistSession(authData.user, authData.token)
  }

  const logout = () => {
    setUser(null)
    clearSession()
  }

  const updateProfile = async (data: Partial<User>) => {
    const updated = await updateUserProfile(data)
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
  }

  const deleteAccount = async () => {
    await deleteUserAccount()
    setUser(null)
    clearSession()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { ApiError }
