import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icon shown on the left side of the input */
  leftIcon?: React.ReactNode
  /** Icon or element shown on the right side */
  rightElement?: React.ReactNode
  /** Error message — renders the input in error state */
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', leftIcon, rightElement, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          aria-invalid={!!error}
          className={cn(
            'flex h-9 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground',
            'placeholder:text-muted-foreground',
            'transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            '-webkit-user-select text user-select-text',
            leftIcon && 'pl-9',
            rightElement && 'pr-9',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
            {rightElement}
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
