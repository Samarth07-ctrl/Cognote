import * as React from 'react'
import { Building2, Laptop, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useOnboardingStore } from '../store/onboarding-store'
import type { AIProcessingLocation } from '@cognote/types'

interface Props { onNext: () => void; onBack: () => void }

const options: {
  location: AIProcessingLocation
  icon: React.ReactNode
  label: string
  description: string
  disabled?: boolean
  disabledReason?: string
}[] = [
  {
    location: 'company_server',
    icon: <Building2 />,
    label: 'Company Cognote Server',
    description: 'Your organization controls the AI environment. All processing stays on company infrastructure.',
  },
  {
    location: 'local',
    icon: <Laptop />,
    label: 'Local AI',
    description: 'Process supported data on this computer. Requires a compatible local AI model.',
  },
  {
    location: 'external',
    icon: <Globe />,
    label: 'External AI Provider',
    description: 'Route processing to an external AI provider.',
    disabled: true,
    disabledReason: 'Only available if enabled by your organization administrator.',
  },
]

export function StepAiLocation({ onNext, onBack }: Props) {
  const { aiLocation, setAiLocation } = useOnboardingStore()

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold text-foreground">AI Processing Location</h2>
        <p className="text-sm text-muted-foreground">
          Choose where AI processing occurs. This controls where your company data is sent for analysis.
        </p>
      </div>

      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.location}
            type="button"
            onClick={() => !opt.disabled && setAiLocation(opt.location)}
            disabled={opt.disabled}
            aria-pressed={aiLocation === opt.location}
            aria-disabled={opt.disabled}
            className={cn(
              'w-full flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors',
              opt.disabled
                ? 'cursor-not-allowed border-border bg-card opacity-50'
                : aiLocation === opt.location
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border bg-card hover:bg-accent'
            )}
          >
            <div className={cn(
              'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full [&_svg]:size-4',
              opt.disabled
                ? 'bg-muted text-muted-foreground'
                : aiLocation === opt.location ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {opt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">{opt.label}</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                {opt.disabled ? opt.disabledReason : opt.description}
              </p>
            </div>
            {!opt.disabled && (
              <div className={cn(
                'mt-1 size-4 shrink-0 rounded-full border-2 flex items-center justify-center',
                aiLocation === opt.location ? 'border-primary' : 'border-border'
              )}>
                {aiLocation === opt.location && <div className="size-2 rounded-full bg-primary" />}
              </div>
            )}
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
