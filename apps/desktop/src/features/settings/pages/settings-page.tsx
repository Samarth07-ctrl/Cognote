import * as React from 'react'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface SettingRowProps {
  label: string
  description?: string
  children: React.ReactNode
  managed?: boolean
}

function SettingRow({ label, description, children, managed = false }: SettingRowProps) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <div className="space-y-0.5 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {managed && (
          <Badge variant="muted" className="mt-1">
            Managed by your organization
          </Badge>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

interface ToggleProps {
  enabled: boolean
  onChange: () => void
  disabled?: boolean
}

function Toggle({ enabled, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        enabled ? 'bg-primary' : 'bg-muted'
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block size-4 rounded-full bg-white shadow-lg ring-0 transition-transform',
          enabled ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  )
}

export function SettingsPage() {
  const { user, organization, logout } = useAuthStore()
  const [notifications, setNotifications] = React.useState(true)
  const [analyticsOptIn, setAnalyticsOptIn] = React.useState(false)

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <div className="space-y-1">
        <h1 className="text-base font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, AI preferences, and application behavior.
        </p>
      </div>

      <Tabs defaultValue="account">
        <TabsList>
          {['Account', 'AI', 'Privacy', 'Notifications', 'About'].map((tab) => (
            <TabsTrigger key={tab} value={tab.toLowerCase()}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Account */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {user && (
                <div className="flex items-center gap-4 pb-4">
                  <Avatar name={user.name} size="lg" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <Badge variant="muted" className="mt-1">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              )}
              {organization && (
                <SettingRow label="Organization" description={organization.id}>
                  <span className="text-sm text-foreground">{organization.name}</span>
                </SettingRow>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Processing</CardTitle>
              <CardDescription>Control where your data is processed for AI features.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <SettingRow
                label="Processing Location"
                description="Where AI models run when generating answers."
                managed
              >
                <Badge variant="default">Company Server</Badge>
              </SettingRow>
              <SettingRow
                label="External AI Provider"
                description="Allow routing to external AI providers."
                managed
              >
                <Toggle enabled={false} onChange={() => undefined} disabled />
              </SettingRow>
              <SettingRow
                label="Response Style"
                description="How Cognote formats generated answers."
                managed
              >
                <span className="text-sm text-muted-foreground">Organization Default</span>
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Controls</CardTitle>
              <CardDescription>Control what data Cognote collects and sends.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <SettingRow
                label="Usage Analytics"
                description="Help improve Cognote by sharing anonymous usage data."
              >
                <Toggle enabled={analyticsOptIn} onChange={() => setAnalyticsOptIn((v) => !v)} />
              </SettingRow>
              <SettingRow
                label="Data Residency"
                description="Where your organization's data is stored."
                managed
              >
                <span className="text-sm text-muted-foreground">Company Server</span>
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desktop Notifications</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <SettingRow
                label="Sync Notifications"
                description="Notify when large sync batches complete."
              >
                <Toggle enabled={notifications} onChange={() => setNotifications((v) => !v)} />
              </SettingRow>
              <SettingRow
                label="Duplicate Alerts"
                description="Alert when duplicate documents are detected."
              >
                <Toggle enabled={notifications} onChange={() => setNotifications((v) => !v)} />
              </SettingRow>
              <SettingRow
                label="Knowledge Conflicts"
                description="Alert when conflicting information is found."
              >
                <Toggle enabled={notifications} onChange={() => setNotifications((v) => !v)} />
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About */}
        <TabsContent value="about">
          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-6 text-white"
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
                <div>
                  <p className="text-sm font-semibold text-foreground">Cognote Desktop</p>
                  <p className="text-xs text-muted-foreground">Version 0.1.0 — Phase 1</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Tauri 2 · React 18 · TypeScript 5</p>
                <p>Enterprise Knowledge Intelligence Platform</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
