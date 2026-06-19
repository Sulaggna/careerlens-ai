import { cn } from '../../utils/cn'

interface ProgressBarProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

function getScoreColor(percentage: number): string {
  if (percentage >= 80) return 'bg-secondary-500'
  if (percentage >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export default function ProgressBar({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1.5 flex justify-between text-sm">
          <span className="text-muted">Score</span>
          <span className="font-semibold text-foreground">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-muted-bg', sizeStyles[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', getScoreColor(percentage))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
