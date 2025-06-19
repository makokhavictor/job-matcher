'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface GoogleAuthButtonProps {
  isSubmitting?: boolean
  mode?: 'login' | 'register'
}

export function GoogleAuthButton({
  isSubmitting,
  mode = 'login',
}: GoogleAuthButtonProps) {
  useEffect(() => {
    // Load GSI script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
        ux_mode: 'popup',
      })

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn')!,
        { theme: 'outline', size: 'large' }
      )
    }

    document.body.appendChild(script)
  }, [])

  const handleCredentialResponse = async (response: {credential: string}) => {
    const idToken = response.credential
    const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL
    // Send token to FastAPI backend
    const res = await fetch(`${backendApiUrl}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken }),
    })

    const data = await res.json()

    if (res.ok) {
      console.log('Logged in:', data)
      toast.success(`Successfully ${mode === 'login' ? 'logged in' : 'registered'} with Google!`);
      // save JWT/token, redirect, etc
    } else {
      console.error('Login failed:', data.detail);
      toast.error(`Failed to ${mode === 'login' ? 'log in' : 'register'} with Google: ${data.detail || 'Unknown error'}`);
    }
  }

  return (
    <div id="google-signin-btn" />
  )
}
