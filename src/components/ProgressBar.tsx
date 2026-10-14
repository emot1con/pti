import { cn, progressRatio } from '../lib/utils'

interface ProgressBarProps {
  value: number
  target: number
  barClassName?: string
  className?: string
  label?: string
}

export function ProgressBar({
  value,
  target,
  barClassName,
  className,
  label,
}: ProgressBarProps) {
  const ratio = progressRatio(value, target)

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(ratio * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-cream-200', className)}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-700 ease-out',
          barClassName,
        )}
        style={{ width: `${Math.max(ratio * 100, ratio > 0 ? 4 : 0)}%` }}
      />
    </div>
  )
}
