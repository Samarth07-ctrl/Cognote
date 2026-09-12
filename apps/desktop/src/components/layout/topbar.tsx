import * as React from 'react'
import { Bell, LogOut, User, ChevronDown } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { ConnectionIndicator } from '@/components/ui/status-badge'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/features/auth/store/auth-store'
import type { SyncConnectionStatus } from '@cognote/types'

interface TopbarProps {
  connectionStatus?: SyncConnectionStatus
  className?: string
}

export function Topbar({ connectionStatus = 'connected', className }: TopbarProps) {
  const { user, logout } = useAuthStore()

  return (
    <header
      className={cn(
        'flex h-topbar items-center justify-between border-b border-border bg-background px-4',
        className
      )}
    >
      {/* Left — page title slot (filled by each page via context if needed) */}
      <div className="flex items-center gap-2" />

      {/* Right — status + notifications + profile */}
      <div className="flex items-center gap-3">
        {/* Connection status */}
        <ConnectionIndicator status={connectionStatus} />

        <Separator orientation="vertical" className="h-5" />

        {/* Notifications (Phase 3+ — stub for now) */}
        <button
          type="button"
          className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Notifications"
        >
          <Bell className="size-4" aria-hidden="true" />
        </button>

        {/* Profile dropdown */}
        {user && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Profile menu"
              >
                <Avatar name={user.name} size="sm" />
                <span className="hidden text-xs font-medium text-foreground sm:block">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="size-3 opacity-60" aria-hidden="true" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className={cn(
                  'z-50 min-w-48 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-xl',
                  'animate-fade-in'
                )}
              >
                {/* User info */}
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>

                <DropdownMenu.Separator className="my-1 h-px bg-border" />

                <DropdownMenu.Item
                  className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground outline-none hover:bg-accent focus:bg-accent"
                  onSelect={() => void 0}
                >
                  <User className="size-4 text-muted-foreground" aria-hidden="true" />
                  Profile
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="my-1 h-px bg-border" />

                <DropdownMenu.Item
                  className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-destructive outline-none hover:bg-destructive/10 focus:bg-destructive/10"
                  onSelect={() => logout()}
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>
    </header>
  )
}
