import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { ModalType } from '@/types'

interface SectorProps {
  path: string
  label: string
  subtitle: string
  color: string
  colorDim: string
  type: NonNullable<ModalType>
  selected: boolean
  hovered: boolean
  textX: number
  textY: number
  onSelect: (type: NonNullable<ModalType>) => void
  onHover: (type: NonNullable<ModalType> | null) => void
}

/**
 * Sector - Setor individual do círculo da Lei de Ohm.
 * Hover usa a cor temática de cada grandeza (não ciano fixo).
 */
export function Sector({
  path,
  label,
  subtitle,
  color,
  colorDim: _colorDim,
  type,
  selected,
  hovered,
  textX,
  textY,
  onSelect,
  onHover,
}: SectorProps): React.JSX.Element {
  const [isHovering, setIsHovering] = useState(false)
  const isActive = selected
  const isDimmed = hovered && !selected

  // Hover usa a cor temática do setor (não ciano fixo)
  const hoverFill   = `${color}22`
  const hoverStroke = color
  const hoverText   = color

  const pathFill =
    isActive   ? `${color}28` :
    isHovering ? hoverFill    :
    isDimmed   ? '#0F1421'    : '#141B2D'

  const pathStroke =
    isActive   ? color       :
    isHovering ? hoverStroke : '#1E293B'

  const pathStrokeWidth = isActive ? 1.5 : isHovering ? 1.5 : 1

  const pathFilter =
    isActive   ? `drop-shadow(0 0 10px ${color}50)` :
    isHovering ? `drop-shadow(0 0 8px ${color}35)`  : 'none'

  const labelFill =
    isActive   ? color     :
    isHovering ? hoverText : '#94A3B8'

  const labelSize = isActive ? '30' : isHovering ? '29' : '27'

  const subtitleFill =
    isActive   ? `${color}DD` :
    isHovering ? `${color}BB` : '#475569'

  return (
    <motion.g
      className="cursor-pointer"
      onClick={() => onSelect(type)}
      onMouseEnter={() => { setIsHovering(true);  onHover(type) }}
      onMouseLeave={() => { setIsHovering(false); onHover(null) }}
      whileTap={{ scale: 0.96 }}
    >
      {/* Sector fill */}
      <motion.path
        d={path}
        fill={pathFill}
        stroke={pathStroke}
        strokeWidth={pathStrokeWidth}
        animate={{
          fill: pathFill,
          stroke: pathStroke,
          strokeWidth: pathStrokeWidth,
        }}
        transition={{ duration: 0.18 }}
        style={{ filter: pathFilter }}
      />

      {/* Symbol label (V, I, R, P) */}
      <motion.text
        x={textX}
        y={textY - 10}
        textAnchor="middle"
        dominantBaseline="middle"
        className="select-none pointer-events-none"
        fontSize={labelSize}
        fontWeight="700"
        fontFamily="Inter, system-ui, sans-serif"
        fill={labelFill}
        animate={{ fill: labelFill, fontSize: labelSize }}
        transition={{ duration: 0.18 }}
      >
        {label}
      </motion.text>

      {/* Subtitle (Tensão, Corrente, etc.) */}
      <motion.text
        x={textX}
        y={textY + 16}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fontFamily="Inter, system-ui, sans-serif"
        fill={subtitleFill}
        animate={{ fill: subtitleFill }}
        transition={{ duration: 0.18 }}
        className="select-none pointer-events-none"
      >
        {subtitle}
      </motion.text>
    </motion.g>
  )
}
