import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** 0–100 */
  value?: number
  /** Show percentage label */
  showLabel?: boolean
  size?: 'sm' | 'md'
  color?: 'default' | 'success' | 'warning' | 'destructive'
}

const colorMap = {
  default: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, showLabel = false, size = 'md', color = 'default', ...props }, ref) => (
  <div className="w-full space-y-1">
    {showLabel && (
      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">{Math.round(value)}%</span>
      </div>
    )}
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-secondary',
        size === 'sm' ? 'h-1' : 'h-2',
        className
      )}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn('h-full w-full flex-1 transition-all duration-300', colorMap[color])}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
