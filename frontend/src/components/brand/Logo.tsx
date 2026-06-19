import { cn } from '../../utils/cn'

interface LogoProps {
  size?: number
  className?: string
  variant?: 'default' | 'white' | 'icon'
  showText?: boolean
}

export default function Logo({
  size = 36,
  className,
  variant = 'default',
  showText = false,
}: LogoProps) {
  const isWhite = variant === 'white'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-xl',
          !isWhite && 'bg-primary-50 p-1 dark:bg-primary-950/40',
        )}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
          </defs>

          <circle cx="31" cy="9" r="2.2" fill={isWhite ? '#2DD4BF' : '#14B8A6'} />
          <circle cx="36" cy="16" r="1.8" fill={isWhite ? '#38BDF8' : '#0EA5E9'} />
          <circle cx="33" cy="23" r="1.6" fill={isWhite ? '#2DD4BF' : '#14B8A6'} />
          <circle cx="27" cy="18" r="1.4" fill={isWhite ? '#7DD3FC' : '#38BDF8'} />
          <line x1="31" y1="9" x2="36" y2="16" stroke={isWhite ? '#2DD4BF' : '#14B8A6'} strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="36" y1="16" x2="33" y2="23" stroke={isWhite ? '#38BDF8' : '#0EA5E9'} strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="31" y1="9" x2="27" y2="18" stroke={isWhite ? '#7DD3FC' : '#38BDF8'} strokeWidth="1.2" strokeOpacity="0.5" />
          <line x1="27" y1="18" x2="33" y2="23" stroke={isWhite ? '#2DD4BF' : '#14B8A6'} strokeWidth="1" strokeOpacity="0.5" />

          <circle
            cx="16"
            cy="16"
            r="10"
            stroke={isWhite ? 'white' : 'url(#logo-grad)'}
            strokeWidth="2.5"
            fill={isWhite ? 'rgba(255,255,255,0.1)' : 'none'}
          />

          <circle cx="13" cy="13" r="1.8" fill={isWhite ? '#38BDF8' : '#0EA5E9'} />
          <circle cx="19" cy="12" r="1.5" fill={isWhite ? '#2DD4BF' : '#14B8A6'} />
          <circle cx="17" cy="19" r="1.5" fill={isWhite ? '#7DD3FC' : '#38BDF8'} />
          <line x1="13" y1="13" x2="19" y2="12" stroke={isWhite ? '#38BDF8' : '#0EA5E9'} strokeWidth="1" strokeOpacity="0.8" />
          <line x1="19" y1="12" x2="17" y2="19" stroke={isWhite ? '#2DD4BF' : '#14B8A6'} strokeWidth="1" strokeOpacity="0.8" />
          <line x1="13" y1="13" x2="17" y2="19" stroke={isWhite ? '#7DD3FC' : '#38BDF8'} strokeWidth="1" strokeOpacity="0.6" />

          <line
            x1="23.5" y1="23.5" x2="31" y2="31"
            stroke={isWhite ? 'white' : 'url(#logo-grad)'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="min-w-0 leading-tight">
          <p
            className={cn(
              'text-base font-bold tracking-tight',
              isWhite ? 'text-white' : 'text-foreground',
            )}
          >
            CareerLens{' '}
            <span className={isWhite ? 'text-white/80' : 'text-primary-500'}>AI</span>
          </p>
          <p className={cn('text-[11px] font-medium', isWhite ? 'text-white/60' : 'text-muted')}>
            Career Intelligence
          </p>
        </div>
      )}
    </div>
  )
}
