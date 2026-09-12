import * as React from 'react'
import { AppProviders } from './providers'
import { AppRouter } from './router'
import { useAuthStore } from '@/features/auth/store/auth-store'

function SessionRestorer({ children }: { children: React.ReactNode }) {
  const restoreSession = useAuthStore((s) => s.restoreSession)

  React.useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return <>{children}</>
}

export function App() {
  return (
    <AppProviders>
      <SessionRestorer>
        <AppRouter />
      </SessionRestorer>
    </AppProviders>
  )
}
