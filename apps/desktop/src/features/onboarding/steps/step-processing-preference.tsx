import * as React from 'react'
import { RefreshCw, MousePointer, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useOnboardingStore } from '../store/onboarding-store'
import type { ProcessingMode } from '@cognote/types'

interface Props { onNext: () => void; onBack: () => void }

const options: {
  mode: ProcessingMode
  icon: React.ReactNode
  label: string
  description: string
  recommended?: boolean
}[] = [
  {
    mode: 'automatic',
    icon: <RefreshCw />,
    label: 'Automatic',
    description: 'Cognote monitors selected folders for changes and processes them automatically.',
    recommended: true,
  },
  {
    mode: 'manual',
    icon: <MousePointer />,
    label: 'Manual',
    description: 'Files are analyzed only when you explicitly request it.',
  },
  {
    mode: 'ask',
    icon: <HelpCircle />,
    label: 'Ask me first',
    description: 'Cognote detects changes and asks for your approval before processing.',
  },
]

export function StepProcessingPreference({ onNext, onBack }: Props) {
  const { processingMode, setProcessingMode } = useOnboardingStore()

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold text-foreground">How Should Cognote Monitor Folders?</h2>
        <p className="text-sm text-muted-foreground">
          Choose how Cognote handles new and changed files in your selected folders.
        </p>
      </div>

      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.mode}
            type="button"
            onClick={() => setProcessingMode(opt.mode)}
            aria-pressed={processingMode === opt.mode}
            className={cn(
              'w-full flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors',
              processingMode === opt.mode
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border bg-card hover:bg-accent'
            )}
          >
            <div className={cn(
              'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full [&_svg]:size-4',
              processingMode === opt.mode ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {opt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{opt.label}</span>
                {opt.recommended && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-2xs font-medium text-primary">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
            </div>
            <div className={cn(
              'mt-1 size-4 shrink-0 rounded-full border-2 flex items-center justify-center',
              processingMode === opt.mode ? 'border-primary' : 'border-border'
            )}>
              {processingMode === opt.mode && <div className="size-2 rounded-full bg-primary" />}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  )
}
