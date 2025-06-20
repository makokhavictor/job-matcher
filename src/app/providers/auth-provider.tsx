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

interface AuthProviderProps {
  children: ReactNode
}

interface User {
  id: string
  email: string
  name: string
  picture?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const pathname = usePathname()
  const router = useRouter()
  const isDashboardRoute = pathname?.startsWith('/dashboard')

  const checkAuth = useCallback(async () => {
    const auth = localStorage.getItem('auth')

    if (isDashboardRoute && !auth) {
      router.push('/login')
      return
    }

    if (auth) {
      const { access_token: token } = JSON.parse(auth)
      const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL

      try {
        const response = await fetch(`${backendApiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          localStorage.removeItem('auth')
        }
      } catch (error: unknown) {
        console.error('Authentication error:', error)
        localStorage.removeItem('auth')
        setUser(null)
      }
    }

    setLoading(false)
  }, [isDashboardRoute, router])

  useEffect(() => {
    if (isDashboardRoute) {
      checkAuth()
    }
  }, [isDashboardRoute, checkAuth])

  const logout = () => {
    localStorage.removeItem('auth')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
