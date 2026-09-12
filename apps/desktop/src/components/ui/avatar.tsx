import * as React from 'react'
import { cn } from '@/lib/utils'
import { initials } from '@/lib/utils'

interface AvatarProps {
  name: string
  imageUrl?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'size-6 text-2xs',
  md: 'size-8 text-xs',
  lg: 'size-10 text-sm',
}

function Avatar({ name, imageUrl, size = 'md', className }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false)
  const abbr = initials(name)

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/20 font-medium text-primary select-none',
        sizeMap[size],
        className
      )}
      aria-label={name}
      title={name}
    >
      {imageUrl && !imgError ? (
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 size-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        abbr
      )}
    </div>
  )
}

export { Avatar }
