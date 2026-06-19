import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const DEMO_USER: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  title: 'Software Engineer',
  location: 'San Francisco, CA',
  bio: 'Passionate developer focused on building impactful products.',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email: string, _password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const loggedInUser = { ...DEMO_USER, email }
    setUser(loggedInUser)
    localStorage.setItem('user', JSON.stringify(loggedInUser))
  }

  const register = async (name: string, email: string, _password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newUser: User = { id: Date.now().toString(), name, email }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateProfile = (data: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
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
