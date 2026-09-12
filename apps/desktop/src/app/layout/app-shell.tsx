import * as React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { useSyncStore } from '@/features/sync/store/sync-store'

/**
 * AppShell — the persistent frame for all authenticated pages.
 * Sidebar + Topbar remain mounted across route changes.
 * Page content renders via <Outlet />.
 */
export function AppShell() {
  const connectionStatus = useSyncStore((s) => s.status.connectionStatus)

  return (
    <div className="flex h-full min-h-app min-w-app overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar connectionStatus={connectionStatus} />
        <main className="flex-1 overflow-y-auto" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
