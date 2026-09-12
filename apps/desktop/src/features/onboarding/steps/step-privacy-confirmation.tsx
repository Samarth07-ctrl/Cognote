import * as React from 'react'
import { ShieldCheck, ShieldOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props { onNext: () => void; onBack: () => void }

const willDo = [
  'Analyze only the folders you explicitly selected',
  'Create searchable knowledge from approved files',
  'Generate metadata and embeddings on the company server',
  "Follow your organization's permission policies at all times",
]

const willNotDo = [
  'Scan folders you have not approved',
  'Access personal files outside approved folders',
  'Send data to external AI providers unless you enabled it',
  "Bypass your company's permission restrictions",
  'Store document contents locally beyond metadata',
]

export function StepPrivacyConfirmation({ onNext, onBack }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Your Privacy</h2>
        <p className="text-sm text-muted-foreground">
          Before scanning begins, confirm what Cognote will and will not do with your data.
        </p>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border border-success/20 bg-success/5 p-4 space-y-2">
          <p className="text-xs font-semibold text-success uppercase tracking-wider">Cognote will</p>
          {willDo.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-foreground">
              <ShieldCheck className="size-4 text-success mt-0.5 shrink-0" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2">
          <p className="text-xs font-semibold text-destructive uppercase tracking-wider">Cognote will not</p>
          {willNotDo.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-foreground">
              <ShieldOff className="size-4 text-destructive mt-0.5 shrink-0" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">I Understand &amp; Continue</Button>
      </div>
    </div>
  )
}
