import * as React from 'react'
import { FolderOpen, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOnboardingStore } from '../store/onboarding-store'
import { pickFolder } from '@/lib/tauri'
import { toast } from '@/hooks/use-toast'

interface Props {
  onNext: () => void
  onBack: () => void
}

export function StepFolderConfirmation({ onNext, onBack }: Props) {
  const { selectedFolders, addFolder, removeFolder } = useOnboardingStore()
  const [isPicking, setIsPicking] = React.useState(false)

  async function handleAdd() {
    setIsPicking(true)
    try {
      const result = await pickFolder()
      if (result) {
        addFolder({ path: result.path, displayName: result.displayName })
      }
    } catch {
      // Dev fallback — Tauri native picker not available outside the desktop runtime
      addFolder({ path: 'C:\\Company\\Documentation', displayName: 'Documentation' })
      toast.info('Development mode', 'Using mock folder path.')
    } finally {
      setIsPicking(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Confirm Selected Folders</h2>
        <p className="text-sm text-muted-foreground">
          Review the folders Cognote will analyze. You can add or remove at any time.
        </p>
      </div>

      <div className="space-y-2">
        {selectedFolders.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            No folders selected. Add at least one folder to continue.
          </p>
        ) : (
          selectedFolders.map((folder) => (
            <div
              key={folder.path}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
            >
              <FolderOpen className="size-5 text-primary shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{folder.displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{folder.path}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFolder(folder.path)}
                className="flex items-center justify-center rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                aria-label={`Remove ${folder.displayName}`}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          ))
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => void handleAdd()}
        loading={isPicking}
      >
        <Plus className="size-4" aria-hidden="true" />
        Add Folder
      </Button>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} className="flex-1" disabled={selectedFolders.length === 0}>
          Continue
        </Button>
      </div>
    </div>
  )
}
