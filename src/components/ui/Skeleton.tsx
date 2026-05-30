interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: boolean
}

export function Skeleton({ className = '', width, height, rounded = false }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${rounded ? 'rounded-full' : 'rounded-sm'} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

// Pre-built skeleton compositions for common patterns

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="w-full h-48" />
      <Skeleton className="w-3/4 h-5" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-2/3 h-4" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-20 h-9 rounded-md" />
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton width={size} height={size} rounded />
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-border">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="flex-1 h-4" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-2">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className={`flex-1 h-4 ${c === 0 ? 'w-20 flex-none' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  )
}
