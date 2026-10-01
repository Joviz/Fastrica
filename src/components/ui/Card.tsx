import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  title?: string
  icon?: React.ReactNode
  accentColor?: string
  children: React.ReactNode
  className?: string
  headerClassName?: string
  bodyClassName?: string
  footer?: React.ReactNode
  onClick?: () => void
  hoverable?: boolean
}

export function Card({
  title,
  icon,
  accentColor,
  children,
  className,
  headerClassName,
  bodyClassName,
  footer,
  onClick,
  hoverable = false,
}: CardProps): React.JSX.Element {
  const hasHeader = title !== undefined || icon !== undefined

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-[#1E293B] bg-[#141B2D]',
        'shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
        'overflow-hidden',
        hoverable && 'transition-all duration-200 cursor-pointer hover:border-[#243451] hover:bg-[#1A233A] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {hasHeader && (
        <div
          className={cn(
            'flex items-center gap-3 px-5 pt-5 pb-0',
            headerClassName
          )}
        >
          {icon && (
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={accentColor ? { backgroundColor: `${accentColor}20`, color: accentColor } : undefined}
            >
              {icon}
            </div>
          )}
          {title && (
            <h3 className="font-semibold text-[#F1F5F9] text-base">{title}</h3>
          )}
        </div>
      )}

      <div className={cn('p-5', hasHeader && 'pt-4', bodyClassName)}>
        {children}
      </div>

      {footer && (
        <div className="px-5 pb-5 border-t border-[#1E293B] pt-4">
          {footer}
        </div>
      )}
    </div>
  )
}
