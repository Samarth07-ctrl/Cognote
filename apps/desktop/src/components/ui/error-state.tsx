import * as React from 'react'
import { AlertCircle, WifiOff, ServerCrash, ShieldOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

type ErrorVariant = 'generic' | 'network' | 'server' | 'unauthorized' | 'not_found'

interface ErrorStateProps {
  variant?: ErrorVariant
  title?: string
  description?: string
  /** What the user can do next */
  hint?: string
  onRetry?: () => void
  className?: string
}

const variantDefaults: Record<
  ErrorVariant,
  { icon: React.ReactNode; title: string; description: string; hint: string }
> = {
  generic: {
    icon: <AlertCircle />,
    title: 'Something went wrong',
    description: 'An unexpected error occurred.',
    hint: 'Try again, or contact your IT administrator if the problem persists.',
  },
  network: {
    icon: <WifiOff />,
    title: 'Cannot reach server',
    description: 'Cognote cannot connect to your organization\'s knowledge server.',
    hint: 'Check your network connection. Your folder permissions are unaffected.',
  },
  server: {
    icon: <ServerCrash />,
    title: 'Server error',
    description: 'The server returned an unexpected error.',
    hint: 'This is not an issue with your machine. Try again in a moment.',
  },
  unauthorized: {
    icon: <ShieldOff />,
    title: 'Session expired',
    description: 'Your session has expired or you no longer have access to this resource.',
    hint: 'Sign in again to continue.',
  },
  not_found: {
    icon: <AlertCircle />,
    title: 'Not found',
    description: 'The resource you\'re looking for doesn\'t exist or has been removed.',
    hint: 'Go back and try again.',
  },
}

function ErrorState({
  variant = 'generic',
  title,
  description,
  hint,
  onRetry,
  className,
}: ErrorStateProps) {
  const defaults = variantDefaults[variant]
  const displayTitle = title ?? defaults.title
  const displayDescription = description ?? defaults.description
  const displayHint = hint ?? defaults.hint

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-12 px-6 text-center',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive [&_svg]:size-6">
        {defaults.icon}
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm font-semibold text-foreground">{displayTitle}</h3>
        <p className="text-xs text-muted-foreground">{displayDescription}</p>
        <p className="text-xs text-muted-foreground/70 mt-1">{displayHint}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

export { ErrorState }
