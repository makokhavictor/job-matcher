'use client'

import { useState, useEffect, useCallback } from 'react'
import { useJobsStore } from '@/stores/jobs.store'
import { authService } from '@/lib/auth.service'

export interface AppNotification {
  id: string
  userId: number
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
  read: boolean
  createdAt: number
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(false)
  const setOnJobSettled = useJobsStore((state) => state.setOnJobSettled)

  const fetchNotifications = useCallback(async () => {
    const auth = authService.getAuthData()
    if (!auth) return

    setLoading(true)
    try {
      const res = await fetch(`/api/notifications?user_id=${auth.user.id}`, {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Refresh notifications whenever a job settles
  useEffect(() => {
    setOnJobSettled(fetchNotifications)
  }, [setOnJobSettled, fetchNotifications])

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const markRead = async (id: string) => {
    const auth = authService.getAuthData()
    if (!auth) return
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    await fetch(`/api/notifications/${id}/read?user_id=${auth.user.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${auth.access_token}` },
    })
  }

  const markAllRead = async () => {
    const auth = authService.getAuthData()
    if (!auth) return
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    await fetch(`/api/notifications/read-all?user_id=${auth.user.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${auth.access_token}` },
    })
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return { notifications, loading, unreadCount, markRead, markAllRead, refetch: fetchNotifications }
}
