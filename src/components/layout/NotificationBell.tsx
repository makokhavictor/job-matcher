'use client'

import { Bell, Check, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNotifications } from '@/hooks/useNotifications'
import type { AppNotification } from '@/hooks/useNotifications'

const TYPE_ICONS: Record<string, string> = {
  match_complete: '✓',
  tailor_complete: '✓',
  match_failed: '✗',
  tailor_failed: '✗',
}

function timeAgo(ts: string | number): string {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function NotificationItem({
  n,
  onRead,
}: {
  n: AppNotification
  onRead: (id: string) => void
}) {
  const isFailed = n.type.endsWith('_failed')

  return (
    <DropdownMenuItem
      className="flex items-start gap-3 p-3 cursor-pointer focus:bg-muted/60"
      onClick={() => !n.read && onRead(n.id)}
    >
      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isFailed
            ? 'bg-red-100 text-red-600'
            : 'bg-emerald-100 text-emerald-600'
        }`}
      >
        {TYPE_ICONS[n.type] ?? '•'}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${n.read ? 'text-muted-foreground' : 'font-medium text-foreground'}`}>
          {n.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.message}</p>
        <p className="text-xs text-muted-foreground/70 mt-1">{timeAgo(n.createdAt)}</p>
      </div>
      {!n.read && (
        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </DropdownMenuItem>
  )
}

export function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.preventDefault()
                markAllRead()
              }}
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
            <Check className="h-8 w-8 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <NotificationItem key={n.id} n={n} onRead={markRead} />
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
