import React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  unit?: string
}

/**
 * Input - Componente de input base do design system Fastrica.
 * Dark mode com focus ring ciano, suporte a label, erro e ícones.
 * - Setas nativas de number removidas
 * - Badge de unidade com contraste WCAG AA
 * - Ícone de erro via Lucide (sem SVG inline)
 */
export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  unit,
  className,
  id,
  ...props
}: InputProps): React.JSX.Element {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[#94A3B8]"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 text-[#475569] pointer-events-none">
            {leftIcon}
          </div>
        )}

        {/* Input field — sem setas nativas de number */}
        <input
          id={inputId}
          className={cn(
            'w-full h-11 px-3 rounded-xl',
            'bg-[#0F1625] text-[#F1F5F9] text-sm',
            'border border-[#243451]',
            'placeholder:text-[#334155]',
            'transition-all duration-200',
            'focus:outline-none focus:border-[#22D3EE] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.15)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            // Remove native number spinners
            '[appearance:textfield]',
            '[&::-webkit-outer-spin-button]:appearance-none',
            '[&::-webkit-inner-spin-button]:appearance-none',
            error && 'border-[#F87171] focus:border-[#F87171] focus:shadow-[0_0_0_3px_rgba(248,113,113,0.15)]',
            leftIcon && 'pl-10',
            (rightIcon || unit) && 'pr-16',
            className
          )}
          {...props}
        />

        {/* Unit badge */}
        {unit && (
          <div className="absolute right-3 flex items-center pointer-events-none">
            <span className="text-xs font-mono font-medium text-[#94A3B8] bg-[#141B2D] px-1.5 py-0.5 rounded border border-[#243451]">
              {unit}
            </span>
          </div>
        )}
        {!unit && rightIcon && (
          <div className="absolute right-3 text-[#475569]">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Error message — usa Lucide AlertCircle em vez de SVG inline */}
      {error && (
        <p className="text-xs text-[#F87171] flex items-center gap-1">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </p>
      )}

      {/* Hint */}
      {!error && hint && (
        <p className="text-xs text-[#475569]">{hint}</p>
      )}
    </div>
  )
}
