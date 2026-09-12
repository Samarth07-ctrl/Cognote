import * as React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Home,
  Search,
  MessageSquare,
  Network,
  BarChart3,
  RefreshCw,
  Shield,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
  end?: boolean
}

const primaryNav: NavItem[] = [
  { label: 'Home', to: '/', icon: <Home />, end: true },
  { label: 'Search', to: '/search', icon: <Search /> },
  { label: 'Ask Cognote', to: '/ask', icon: <MessageSquare /> },
  { label: 'Knowledge', to: '/knowledge', icon: <Network /> },
  { label: 'Insights', to: '/insights', icon: <BarChart3 /> },
]

const secondaryNav: NavItem[] = [
  { label: 'Sync', to: '/sync', icon: <RefreshCw /> },
  { label: 'Permissions', to: '/permissions', icon: <Shield /> },
  { label: 'Settings', to: '/settings', icon: <Settings /> },
]

function SidebarNavItem({ item }: { item: NavItem }) {
  return (
    <Tooltip content={item.label} side="right" delayDuration={600}>
      <NavLink
        to={item.to}
        end={item.end}
        className={({ isActive }) =>
          cn(
            'group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
            'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
              : 'text-sidebar-foreground'
          )
        }
      >
        <span className="[&_svg]:size-4 [&_svg]:shrink-0">{item.icon}</span>
        <span className="flex-1 truncate">{item.label}</span>
        <ChevronRight className="size-3 opacity-0 group-hover:opacity-40 transition-opacity" aria-hidden="true" />
      </NavLink>
    </Tooltip>
  )
}

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full w-sidebar shrink-0 flex-col border-r border-sidebar-border bg-sidebar',
        className
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex h-topbar items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-4 text-white"
            aria-hidden="true"
          >
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-sm font-semibold tracking-tight text-foreground">Cognote</span>
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {primaryNav.map((item) => (
          <SidebarNavItem key={item.to} item={item} />
        ))}

        <div className="py-2 px-1">
          <Separator />
        </div>

        {secondaryNav.map((item) => (
          <SidebarNavItem key={item.to} item={item} />
        ))}
      </nav>
    </aside>
  )
}
