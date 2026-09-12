import * as React from 'react'
import { QueryProvider } from './query-provider'
import { GlobalTooltipProvider } from './tooltip-provider'
import { Toaster } from '@/components/ui/toaster'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <GlobalTooltipProvider>
        {children}
        <Toaster />
      </GlobalTooltipProvider>
    </QueryProvider>
  )
}
