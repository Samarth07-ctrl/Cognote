import * as React from 'react'
import { createHashRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { AppShell } from '@/app/layout/app-shell'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { LoadingOverlay } from '@/components/ui/spinner'

// ─── Lazy page imports ────────────────────────────────────────────────────────
const LoginPage = React.lazy(() =>
  import('@/features/auth/pages/login-page').then((m) => ({ default: m.LoginPage }))
)
const OnboardingPage = React.lazy(() =>
  import('@/features/onboarding/pages/onboarding-page').then((m) => ({ default: m.OnboardingPage }))
)
const HomePage = React.lazy(() =>
  import('@/features/home/pages/home-page').then((m) => ({ default: m.HomePage }))
)
const SearchPage = React.lazy(() =>
  import('@/features/search/pages/search-page').then((m) => ({ default: m.SearchPage }))
)
const AskPage = React.lazy(() =>
  import('@/features/chat/pages/ask-page').then((m) => ({ default: m.AskPage }))
)
const KnowledgePage = React.lazy(() =>
  import('@/features/knowledge/pages/knowledge-page').then((m) => ({ default: m.KnowledgePage }))
)
const InsightsPage = React.lazy(() =>
  import('@/features/insights/pages/insights-page').then((m) => ({ default: m.InsightsPage }))
)
const DigitalWastePage = React.lazy(() =>
  import('@/features/insights/pages/digital-waste-page').then((m) => ({ default: m.DigitalWastePage }))
)
const DecisionLineagePage = React.lazy(() =>
  import('@/features/insights/pages/decision-lineage-page').then((m) => ({ default: m.DecisionLineagePage }))
)
const KnowledgeHealthPage = React.lazy(() =>
  import('@/features/insights/pages/knowledge-health-page').then((m) => ({ default: m.KnowledgeHealthPage }))
)
const SyncPage = React.lazy(() =>
  import('@/features/sync/pages/sync-page').then((m) => ({ default: m.SyncPage }))
)
const PermissionsPage = React.lazy(() =>
  import('@/features/permissions/pages/permissions-page').then((m) => ({ default: m.PermissionsPage }))
)
const SettingsPage = React.lazy(() =>
  import('@/features/settings/pages/settings-page').then((m) => ({ default: m.SettingsPage }))
)

function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<div className="flex h-full items-center justify-center"><LoadingOverlay /></div>}>
      {children}
    </React.Suspense>
  )
}

function RequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

// HashRouter required for Tauri — no web server to handle deep links
const router = createHashRouter([
  { path: '/login', element: <PageSuspense><LoginPage /></PageSuspense> },
  { path: '/onboarding', element: <PageSuspense><OnboardingPage /></PageSuspense> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <PageSuspense><HomePage /></PageSuspense> },
          { path: 'search', element: <PageSuspense><SearchPage /></PageSuspense> },
          { path: 'ask', element: <PageSuspense><AskPage /></PageSuspense> },
          { path: 'knowledge', element: <PageSuspense><KnowledgePage /></PageSuspense> },
          {
            path: 'insights',
            children: [
              { index: true, element: <PageSuspense><InsightsPage /></PageSuspense> },
              { path: 'waste', element: <PageSuspense><DigitalWastePage /></PageSuspense> },
              { path: 'decisions', element: <PageSuspense><DecisionLineagePage /></PageSuspense> },
              { path: 'health', element: <PageSuspense><KnowledgeHealthPage /></PageSuspense> },
            ],
          },
          { path: 'sync', element: <PageSuspense><SyncPage /></PageSuspense> },
          { path: 'permissions', element: <PageSuspense><PermissionsPage /></PageSuspense> },
          { path: 'settings', element: <PageSuspense><SettingsPage /></PageSuspense> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
