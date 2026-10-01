import React, { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  accentColor?: string
  icon?: React.ReactNode
  size?: ModalSize
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  closeOnOverlayClick?: boolean
}

const sizeMap: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

/**
 * Modal - Componente de modal base do design system Fastrica.
 * - overflow-hidden para respeitar cantos arredondados
 * - Bottom-sheet em mobile (sm:bottom-0 sm:rounded-b-none)
 * - Subtítulo com contraste WCAG AA (#94A3B8)
 * - Botão de fechar unificado (sem duplicação)
 */
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  accentColor,
  icon,
  size = 'md',
  children,
  footer,
  className,
  closeOnOverlayClick = true,
}: ModalProps): React.JSX.Element {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  const hasHeader = title !== undefined || icon !== undefined

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="modal-overlay"
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Modal Panel — bottom-sheet em mobile, centralizado em desktop */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
              key="modal-panel"
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className={cn(
                'relative w-full overflow-hidden',
                // Desktop: rounded-2xl e max-width limitado
                'sm:rounded-2xl',
                // Mobile: bottom-sheet com cantos superiores arredondados
                'rounded-t-2xl rounded-b-none sm:rounded-2xl',
                'bg-[#141B2D] border border-[#243451] border-b-0 sm:border-b',
                'shadow-[0_-8px_32px_rgba(0,0,0,0.4)] sm:shadow-[0_24px_64px_rgba(0,0,0,0.6)]',
                'flex flex-col',
                'max-h-[90vh]',
                sizeMap[size],
                className
              )}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Accent top border */}
              {accentColor && (
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: accentColor }}
                />
              )}

              {/* Header */}
              {hasHeader && (
                <div className="flex items-start justify-between p-6 pb-0">
                  <div className="flex items-center gap-3">
                    {icon && (
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-xl text-lg shrink-0"
                        style={
                          accentColor
                            ? { backgroundColor: `${accentColor}20`, color: accentColor }
                            : { backgroundColor: '#1A233A', color: '#22D3EE' }
                        }
                      >
                        {icon}
                      </div>
                    )}
                    <div>
                      {title && (
                        <h2 className="text-lg font-bold text-[#F1F5F9] leading-tight">
                          {title}
                        </h2>
                      )}
                      {subtitle && (
                        <p className="text-sm text-[#94A3B8] mt-0.5">{subtitle}</p>
                      )}
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ml-2',
                      'text-[#475569] hover:text-[#F1F5F9] hover:bg-[#1A233A]',
                      'transition-all duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]'
                    )}
                    aria-label="Fechar modal"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Close button when no header */}
              {!hasHeader && (
                <button
                  onClick={onClose}
                  className={cn(
                    'absolute top-4 right-4',
                    'flex items-center justify-center w-8 h-8 rounded-lg',
                    'text-[#475569] hover:text-[#F1F5F9] hover:bg-[#1A233A]',
                    'transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]'
                  )}
                  aria-label="Fechar modal"
                >
                  <X size={16} />
                </button>
              )}

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-6 pb-6 border-t border-[#1E293B] pt-4">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
