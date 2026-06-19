import { type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: { value: number; label: string }
  className?: string
}

export default function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  const trendIcon =
    trend && trend.value > 0 ? (
      <TrendingUp className="h-4 w-4" />
    ) : trend && trend.value < 0 ? (
      <TrendingDown className="h-4 w-4" />
    ) : (
      <Minus className="h-4 w-4" />
    )

  const trendColor =
    trend && trend.value > 0
      ? 'text-emerald-600 dark:text-emerald-400'
      : trend && trend.value < 0
        ? 'text-red-600 dark:text-red-400'
        : 'text-muted'

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/10',
        'dark:hover:border-primary-800 dark:hover:shadow-primary-500/5',
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-secondary-500/0 transition-all duration-300 group-hover:from-primary-500/5 group-hover:to-secondary-500/5" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium tracking-wide text-muted uppercase">{title}</p>
          <p className="mt-3 text-4xl font-bold tracking-tight text-foreground">{value}</p>
          {trend && (
            <div className={cn('mt-3 flex items-center gap-1.5 text-sm font-medium', trendColor)}>
              {trendIcon}
              <span>
                {trend.value > 0 ? '+' : ''}
                {trend.value}% {trend.label}
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl',
            'bg-primary-50 text-primary-500 dark:bg-primary-950/50 dark:text-primary-400',
            'transition-transform duration-300 group-hover:scale-110',
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
