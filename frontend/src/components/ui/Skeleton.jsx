import { cn } from '../../utils/cn'

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  )
}

function SkeletonText({ lines = 1, className, ...props }) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

function SkeletonCard({ className, ...props }) {
  return (
    <div className={cn('p-6 space-y-4', className)} {...props}>
      <Skeleton className="h-6 w-3/4" />
      <SkeletonText lines={3} />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  )
}

Skeleton.Text = SkeletonText
Skeleton.Card = SkeletonCard

export default Skeleton
