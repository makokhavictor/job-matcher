"use client"
import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import type { Subscription } from '@/types/package'
import { useAnalysisStore } from '@/stores/analysis.store'
import { authService, AuthResponse } from '@/lib/auth.service'

interface AuthProviderProps {
  children: ReactNode
}

export interface User {
  id: string | number
  email: string
  name: string
  picture?: string
  is_admin?: boolean
  subscription?: Subscription
}

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => void
  checkAuth: () => Promise<void>
  login: (authResponse: AuthResponse) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const pathname = usePathname()
  const router = useRouter()
  const isDashboardRoute = pathname?.startsWith('/dashboard')

  const fetchRecentAnalyses = useAnalysisStore((state) => state.fetchRecentAnalyses)

  const checkAuth = useCallback(async () => {
    const authData = authService.getAuthData()

    if (isDashboardRoute && !authData) {
      router.push('/login')
      setLoading(false)
      return
    }

    if (authData) {
      try {
        const userData = await authService.getCurrentUser(authData.access_token)
        setUser(userData)
      } catch (error: unknown) {
        console.error('Authentication error:', error)
        authService.clearAuthData()
        setUser(null)
        if (isDashboardRoute) {
          router.push('/login')
        }
      }
    }

    setLoading(false)
  }, [isDashboardRoute, router])

  useEffect(() => {
    if (isDashboardRoute) {
      checkAuth()
    }
  }, [isDashboardRoute, checkAuth])

  // Fetch recent analyses after login or reload if user is present
  useEffect(() => {
    if (isDashboardRoute && user) {
      fetchRecentAnalyses()
    }
  }, [isDashboardRoute, user, fetchRecentAnalyses])

  const logout = () => {
    authService.clearAuthData()
    setUser(null)
    router.push('/login')
  }

  const login = (authResponse: AuthResponse) => {
    authService.saveAuthData(authResponse)
    setUser(authResponse.user)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, checkAuth, login }}>
      {children}
    </AuthContext.Provider>
  )
}
