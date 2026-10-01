import React from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-[#22D3EE] text-[#0B0F19] font-semibold',
    'hover:bg-[#38BDF8] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]',
    'active:bg-[#0891B2]',
    'disabled:bg-[#0891B2]/40 disabled:cursor-not-allowed',
  ].join(' '),
  secondary: [
    'bg-[#1A233A] text-[#F1F5F9] font-medium border border-[#243451]',
    'hover:bg-[#1F2A44] hover:border-[#22D3EE]/40',
    'active:bg-[#141B2D]',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),
  ghost: [
    'bg-transparent text-[#94A3B8] font-medium',
    'hover:bg-[#141B2D] hover:text-[#F1F5F9]',
    'active:bg-[#1A233A]',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),
  outline: [
    'bg-transparent text-[#22D3EE] font-medium border border-[#22D3EE]/60',
    'hover:bg-[#22D3EE]/10 hover:border-[#22D3EE]',
    'active:bg-[#22D3EE]/20',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
}

/**
 * Button - Componente de botão base do design system Fastrica.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps): React.JSX.Element {
  const isDisabled = disabled || loading

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center',
        'transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F19]',
        'select-none cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size={size} />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  )
}

/** Internal spinner for loading state */
function LoadingSpinner({ size }: { size: ButtonSize }): React.JSX.Element {
  const spinnerSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <svg
      className={cn('animate-spin', spinnerSize)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
