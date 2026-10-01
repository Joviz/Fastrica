import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/utils'

interface ResultDisplayProps {
  value: number | null | undefined
  unit: string
  label?: string
  formula?: string
  accentColor?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: {
    value: 'text-2xl font-bold',
    unit: 'text-sm',
    label: 'text-xs',
    formula: 'text-xs',
    container: 'p-4',
  },
  md: {
    value: 'text-3xl font-bold',
    unit: 'text-base',
    label: 'text-sm',
    formula: 'text-xs',
    container: 'p-5',
  },
  lg: {
    value: 'text-4xl font-bold',
    unit: 'text-lg',
    label: 'text-base',
    formula: 'text-sm',
    container: 'p-6',
  },
}

/**
 * ResultDisplay - Componente para exibir resultados de cálculos.
 * Destaque visual com cor de acento, unidade, e fórmula aplicada.
 */
export function ResultDisplay({
  value,
  unit,
  label = 'Resultado',
  formula,
  accentColor = '#22D3EE',
  className,
  size = 'md',
}: ResultDisplayProps): React.JSX.Element {
  const hasValue = value !== null && value !== undefined && isFinite(value)
  const styles = sizeMap[size]

  return (
    <div
      className={cn(
        'relative rounded-2xl border overflow-hidden',
        'bg-gradient-to-br from-[#0F1625] to-[#141B2D]',
        hasValue ? 'border-[#243451]' : 'border-[#1E293B]',
        styles.container,
        className
      )}
      style={
        hasValue
          ? { boxShadow: `0 0 20px ${accentColor}20, inset 0 0 40px ${accentColor}08` }
          : undefined
      }
    >
      {/* Background glow when has value */}
      {hasValue && (
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${accentColor}, transparent 70%)`,
          }}
        />
      )}

      {/* Label */}
      <p className={cn('text-[#475569] mb-2', styles.label)}>{label}</p>

      {/* Value */}
      <AnimatePresence mode="wait">
        <motion.div
          key={hasValue ? 'value' : 'empty'}
          className="flex items-baseline gap-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
        >
          <span
            className={cn(
              styles.value,
              'font-mono tracking-tight',
              hasValue ? 'text-[#F1F5F9]' : 'text-[#243451]'
            )}
          >
            {hasValue ? formatNumber(value!, 4) : '—'}
          </span>
          {hasValue && (
            <span
              className={cn(styles.unit, 'font-medium')}
              style={{ color: accentColor }}
            >
              {unit}
            </span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Formula */}
      {formula && (
        <div className="mt-3 pt-3 border-t border-[#1E293B]">
          <p className={cn('text-[#475569]', styles.formula)}>Fórmula aplicada:</p>
          <p
            className={cn('font-mono font-medium mt-0.5', styles.formula)}
            style={{ color: hasValue ? accentColor : '#475569' }}
          >
            {formula}
          </p>
        </div>
      )}
    </div>
  )
}
