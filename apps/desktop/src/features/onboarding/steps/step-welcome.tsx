import * as React from 'react'
import { Button } from '@/components/ui/button'

interface Props { onNext: () => void }

export function StepWelcome({ onNext }: Props) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
        <svg viewBox="0 0 24 24" fill="none" className="size-9 text-white" aria-hidden="true">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">COGNOTE</h1>
        <p className="text-base text-muted-foreground font-medium">Your Organization's Memory</p>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Cognote helps you securely connect approved company knowledge to your organization's
          intelligence platform — searchable, citable, and always under your control.
        </p>
      </div>

      <Button size="lg" onClick={onNext} className="w-full max-w-xs">
        Get Started
      </Button>

      <p className="text-2xs text-muted-foreground/60">
        Enterprise-grade · Permission-controlled · Explainable AI
      </p>
    </div>
  )
}
