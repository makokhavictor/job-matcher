// context/AuthContext.js
'use client'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
interface AuthProviderProps {
  children: ReactNode
}

interface User {
  id: string
  email: string
  name: string
  image?: string
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

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const auth = localStorage.getItem('auth')
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
        // Handle network or other errors
        console.error(
          'Authentication error:',
          error instanceof Error ? error.message : 'Unknown error'
        )
        localStorage.removeItem('auth')
        setUser(null)
      }
    }
    setLoading(false)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
