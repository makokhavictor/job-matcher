import { User } from '@/app/providers/auth-provider'
import type { Subscription } from '@/types/package'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
  subscription?: Subscription
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  plan?: string
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Login failed')
    }

    return response.json()
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Registration failed')
    }

    return response.json()
  }

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get user information')
    }

    return response.json()
  }

  saveAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('auth', JSON.stringify({
      access_token: authResponse.access_token,
      token_type: authResponse.token_type,
      user: authResponse.user,
      subscription: authResponse.subscription
    }))
  }

  getAuthData(): { access_token: string; user: User } | null {
    const auth = localStorage.getItem('auth')
    if (!auth) return null
    
    try {
      return JSON.parse(auth)
    } catch {
      return null
    }
  }

  clearAuthData(): void {
    localStorage.removeItem('auth')
  }
}

export const authService = new AuthService()
