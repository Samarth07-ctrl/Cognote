import * as React from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'

export function GlobalTooltipProvider({ children }: { children: React.ReactNode }) {
  return <TooltipProvider delayDuration={400}>{children}</TooltipProvider>
}
