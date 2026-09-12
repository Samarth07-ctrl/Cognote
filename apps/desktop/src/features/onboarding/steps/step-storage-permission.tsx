import * as React from 'react'
import { FolderOpen, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOnboardingStore } from '../store/onboarding-store'
import { pickFolder } from '@/lib/tauri'
import { toast } from '@/hooks/use-toast'

interface Props { onNext: () => void; onBack: () => void }

export function StepStoragePermission({ onNext, onBack }: Props) {
  const { addFolder, selectedFolders } = useOnboardingStore()
  const [isPicking, setIsPicking] = React.useState(false)

  async function handlePickFolder() {
    setIsPicking(true)
    try {
      const result = await pickFolder()
      if (result) {
        addFolder({ path: result.path, displayName: result.displayName })
        toast.success('Folder added', result.displayName)
      }
    } catch {
      // Tauri not available outside the desktop runtime — add a dev fallback
      toast.error('Folder picker unavailable', 'Run inside Tauri to use the native folder picker.')
      addFolder({ path: 'C:\\Company\\Engineering', displayName: 'Engineering' })
    } finally {
      setIsPicking(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="size-6 text-primary" aria-hidden="true" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-foreground">Connect Your Knowledge</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Cognote needs permission to analyze specific folders containing company knowledge.
          You choose exactly which folders Cognote can access.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Why we need this
        </p>
        {[
          'Cognote only reads folders you explicitly select',
          'You can remove access at any time from Permissions',
          'Cognote will never scan your entire computer',
          'Your IT administrator can set additional restrictions',
        ].map((point) => (
          <div key={point} className="flex items-start gap-2 text-sm text-foreground">
            <ShieldCheck className="size-4 text-success mt-0.5 shrink-0" aria-hidden="true" />
            {point}
          </div>
        ))}
      </div>

      {selectedFolders.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-3 space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Selected folders</p>
          {selectedFolders.map((f) => (
            <div key={f.path} className="flex items-center gap-2 text-sm text-foreground">
              <FolderOpen className="size-4 text-primary shrink-0" aria-hidden="true" />
              <span className="font-medium">{f.displayName}</span>
            </div>
          ))}
        </div>
      )}

      <Button
        variant="outline"
        className="w-full"
        onClick={() => void handlePickFolder()}
        loading={isPicking}
      >
        <FolderOpen className="size-4" aria-hidden="true" />
        Select Folders
      </Button>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1" disabled={selectedFolders.length === 0}>
          Continue
        </Button>
      </div>
    </div>
  )
}
