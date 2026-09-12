import * as React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useOnboardingStore } from '../store/onboarding-store'

interface Props {
  onComplete: () => void
}

interface FolderScanState {
  displayName: string
  progress: number
  filesDiscovered: number
  filesSupported: number
  filesSkipped: number
  duplicatesDetected: number
  done: boolean
}

// MOCK — replace with real Tauri/WebSocket scan progress events in Phase 6
function useMockScan(folderCount: number) {
  const [folderStates, setFolderStates] = React.useState<FolderScanState[]>([])
  const [scanDone, setScanDone] = React.useState(false)

  // Initialise states once on mount based on folder count
  React.useEffect(() => {
    setFolderStates(
      Array.from({ length: folderCount }, (_, i) => ({
        displayName: `Folder ${i + 1}`,
        progress: 0,
        filesDiscovered: 0,
        filesSupported: 0,
        filesSkipped: 0,
        duplicatesDetected: 0,
        done: false,
      }))
    )
  }, [folderCount])

  React.useEffect(() => {
    if (folderStates.length === 0) return

    const targets = Array.from({ length: folderCount }, (_, i) => ({
      discovered: 800 + i * 600,
      duplicates: 40 + i * 20,
    }))

    const interval = setInterval(() => {
      setFolderStates((prev) =>
        prev.map((f, i) => {
          if (f.done) return f
          const target = targets[i] ?? { discovered: 500, duplicates: 10 }
          const newProgress = Math.min(f.progress + 2 + Math.random() * 3, 100)
          const ratio = newProgress / 100
          const discovered = Math.floor(target.discovered * ratio)
          return {
            ...f,
            progress: newProgress,
            filesDiscovered: discovered,
            filesSupported: Math.floor(discovered * 0.96),
            filesSkipped: Math.floor(discovered * 0.04),
            duplicatesDetected: Math.floor(target.duplicates * ratio),
            done: newProgress >= 100,
          }
        })
      )
    }, 80)

    return () => clearInterval(interval)
  }, [folderStates.length, folderCount])

  React.useEffect(() => {
    if (folderStates.length > 0 && folderStates.every((f) => f.done)) {
      setScanDone(true)
    }
  }, [folderStates])

  return { folderStates, scanDone }
}

export function StepInitialScan({ onComplete }: Props) {
  const { selectedFolders } = useOnboardingStore()

  // Ensure we always have at least one folder to display
  const displayFolders =
    selectedFolders.length > 0
      ? selectedFolders
      : [{ displayName: 'Engineering' }, { displayName: 'Projects' }]

  const { folderStates, scanDone } = useMockScan(displayFolders.length)

  // Merge display names into scan states
  const namedStates: FolderScanState[] = folderStates.map((s, i) => ({
    ...s,
    displayName: displayFolders[i]?.displayName ?? s.displayName,
  }))

  const totals = namedStates.reduce(
    (acc, f) => ({
      discovered: acc.discovered + f.filesDiscovered,
      supported: acc.supported + f.filesSupported,
      skipped: acc.skipped + f.filesSkipped,
      duplicates: acc.duplicates + f.duplicatesDetected,
    }),
    { discovered: 0, supported: 0, skipped: 0, duplicates: 0 }
  )

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        {scanDone ? (
          <>
            <div className="flex justify-center">
              <CheckCircle2 className="size-12 text-success" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Scan Complete</h2>
            <p className="text-sm text-muted-foreground">
              Cognote has finished scanning your approved folders and is now indexing your knowledge.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-foreground">Preparing Cognote…</h2>
            <p className="text-sm text-muted-foreground">
              Scanning approved folders. This may take a few minutes. The app will remain responsive.
            </p>
          </>
        )}
      </div>

      {/* Per-folder progress bars */}
      <div className="space-y-4">
        {namedStates.map((folder) => (
          <div key={folder.displayName} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{folder.displayName}</span>
              <span className="text-xs text-muted-foreground">
                {folder.done ? 'Done' : `${Math.round(folder.progress)}%`}
              </span>
            </div>
            <Progress value={folder.progress} color={folder.done ? 'success' : 'default'} />
          </div>
        ))}
      </div>

      {/* Running totals */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Files discovered', value: totals.discovered.toLocaleString() },
          { label: 'Supported files', value: totals.supported.toLocaleString() },
          { label: 'Skipped files', value: totals.skipped.toLocaleString() },
          { label: 'Duplicates detected', value: totals.duplicates.toLocaleString() },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card px-3 py-2">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-base font-semibold tabular-nums text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {scanDone ? (
        <Button onClick={onComplete} className="w-full">
          Open Cognote
        </Button>
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          You can continue using the app — scanning runs in the background.
        </p>
      )}
    </div>
  )
}
