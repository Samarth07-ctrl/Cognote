// ─── Class Utilities ──────────────────────────────────────────────────────────
// cn() merges Tailwind class strings safely.
// Apps must install clsx + tailwind-merge; this re-exports the pattern.

type ClassValue = string | undefined | null | false | ClassValue[]

function flattenClasses(values: ClassValue[]): string[] {
  const result: string[] = []
  for (const v of values) {
    if (!v) continue
    if (Array.isArray(v)) {
      result.push(...flattenClasses(v))
    } else {
      result.push(v)
    }
  }
  return result
}

/**
 * Lightweight class merger — used in the shared package.
 * In apps/desktop the full `cn` with tailwind-merge is used instead.
 */
export function cx(...classes: ClassValue[]): string {
  return flattenClasses(classes).join(' ')
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i] ?? 'B'}`
}

export function formatRelativeTime(isoDate: string): string {
  const now = Date.now()
  const then = new Date(isoDate).getTime()
  const diffMs = now - then
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength - 3)}...`
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
