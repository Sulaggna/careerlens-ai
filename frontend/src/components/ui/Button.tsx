import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-primary-600 text-white',
    'hover:bg-primary-700 active:bg-primary-800',
    'focus-visible:ring-primary-500',
    'shadow-sm shadow-primary-600/30',
    'disabled:bg-primary-400 disabled:text-white/80',
  ].join(' '),
  secondary: [
    'border-2 border-white bg-transparent text-white',
    'hover:bg-white/15 hover:border-white active:bg-white/25',
    'focus-visible:ring-white/60',
    'disabled:border-white/40 disabled:text-white/50',
  ].join(' '),
  outline: [
    'border border-border bg-card text-foreground',
    'hover:bg-muted-bg hover:border-primary-400',
    'dark:hover:border-primary-500',
    'active:bg-muted-bg/80',
    'focus-visible:ring-primary-500',
    'disabled:text-muted disabled:border-border',
  ].join(' '),
  ghost: [
    'text-foreground bg-transparent',
    'hover:bg-muted-bg active:bg-muted-bg/80',
    'focus-visible:ring-primary-400',
    'disabled:text-muted',
  ].join(' '),
  danger: [
    'bg-red-600 text-white',
    'hover:bg-red-700 active:bg-red-800',
    'focus-visible:ring-red-500',
    'shadow-sm',
    'disabled:bg-red-400 disabled:text-white/80',
  ].join(' '),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  )
}
