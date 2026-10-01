import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator } from 'lucide-react'
import { Sector } from './Sector'
import { grandezaInfo } from '@/types'
import type { ModalType } from '@/types'

interface CircleSelectorProps {
  selected?: ModalType
  onSelect: (type: NonNullable<ModalType>) => void
  size?: number
  className?: string
}

const CX = 200
const CY = 200
const OUTER_R = 175
const INNER_R = 62
const GAP = 3

function buildSectorPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startDeg: number,
  endDeg: number
): string {
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180

  const outerStart = {
    x: cx + outerR * Math.cos(toRad(startDeg)),
    y: cy + outerR * Math.sin(toRad(startDeg)),
  }
  const outerEnd = {
    x: cx + outerR * Math.cos(toRad(endDeg)),
    y: cy + outerR * Math.sin(toRad(endDeg)),
  }
  const innerStart = {
    x: cx + innerR * Math.cos(toRad(startDeg)),
    y: cy + innerR * Math.sin(toRad(startDeg)),
  }
  const innerEnd = {
    x: cx + innerR * Math.cos(toRad(endDeg)),
    y: cy + innerR * Math.sin(toRad(endDeg)),
  }

  const largeArc = endDeg - startDeg > 180 ? 1 : 0

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

function getSectorTextPos(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180
  const midDeg = (startDeg + endDeg) / 2
  return {
    x: cx + r * Math.cos(toRad(midDeg)),
    y: cy + r * Math.sin(toRad(midDeg)),
  }
}

const SECTORS: Array<{
  type: NonNullable<ModalType>
  startDeg: number
  endDeg: number
}> = [
  { type: 'V', startDeg: 0 + GAP,     endDeg: 90 - GAP },
  { type: 'P', startDeg: 90 + GAP,    endDeg: 180 - GAP },
  { type: 'R', startDeg: 180 + GAP,   endDeg: 270 - GAP },
  { type: 'I', startDeg: 270 + GAP,   endDeg: 360 - GAP },
]

const TEXT_RADIUS = (OUTER_R + INNER_R) / 2

export function CircleSelector({
  selected,
  onSelect,
  size,
  className,
}: CircleSelectorProps): React.JSX.Element {
  const [hovered, setHovered] = useState<NonNullable<ModalType> | null>(null)

  return (
    <div
      className={className}
      style={size !== undefined ? { width: size, height: size } : undefined}
    >
      <svg
        viewBox="0 0 400 400"
        width={size ?? '100%'}
        height={size ?? undefined}
        style={{ overflow: 'visible', display: 'block' }}
      >
        <circle
          cx={CX}
          cy={CY}
          r={OUTER_R + 12}
          fill="none"
          stroke="#1E293B"
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity="0.6"
        />

        <AnimatePresence>
          {selected && (
            <motion.circle
              key="glow-ring"
              cx={CX}
              cy={CY}
              r={OUTER_R + 2}
              fill="none"
              stroke={grandezaInfo[selected].color}
              strokeWidth="2"
              opacity="0"
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              style={{ filter: `drop-shadow(0 0 8px ${grandezaInfo[selected].color})` }}
            />
          )}
        </AnimatePresence>

        {SECTORS.map(({ type, startDeg, endDeg }) => {
          const path = buildSectorPath(CX, CY, OUTER_R, INNER_R, startDeg, endDeg)
          const textPos = getSectorTextPos(CX, CY, TEXT_RADIUS, startDeg, endDeg)
          const info = grandezaInfo[type]

          return (
            <Sector
              key={type}
              path={path}
              label={info.symbol}
              subtitle={info.name}
              color={info.color}
              colorDim={info.colorDim}
              type={type}
              selected={selected === type}
              hovered={hovered !== null && hovered !== type}
              textX={textPos.x}
              textY={textPos.y}
              onSelect={onSelect}
              onHover={setHovered}
            />
          )
        })}

        <motion.circle
          cx={CX}
          cy={CY}
          r={INNER_R - 4}
          fill="#0F1625"
          stroke="#243451"
          strokeWidth="1.5"
          animate={
            selected
              ? {
                  stroke: grandezaInfo[selected].color,
                  strokeWidth: 2,
                }
              : {
                  stroke: '#243451',
                  strokeWidth: 1.5,
                }
          }
          transition={{ duration: 0.3 }}
        />

        <motion.g
          style={{ transformOrigin: `${CX}px ${CY}px` }}
          animate={selected ? { scale: 1.15 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <foreignObject
            x={CX - 18}
            y={CY - 18}
            width={36}
            height={36}
            style={{ overflow: 'visible' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                color: selected ? grandezaInfo[selected].color : '#475569',
                transition: 'color 0.3s ease',
              }}
            >
              <Calculator size={28} strokeWidth={1.5} />
            </div>
          </foreignObject>
        </motion.g>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.text
              key={selected}
              x={CX}
              y={CY + 32}
              textAnchor="middle"
              fontSize="10"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="500"
              fill={grandezaInfo[selected].color}
              initial={{ opacity: 0, y: CY + 28 }}
              animate={{ opacity: 0.8, y: CY + 32 }}
              exit={{ opacity: 0, y: CY + 36 }}
              transition={{ duration: 0.2 }}
              className="select-none"
            >
              {grandezaInfo[selected].unit}
            </motion.text>
          )}
        </AnimatePresence>

        {[0, 90, 180, 270].map((angle) => {
          const toRad = (d: number) => ((d - 90) * Math.PI) / 180
          const innerX = CX + INNER_R * Math.cos(toRad(angle))
          const innerY = CY + INNER_R * Math.sin(toRad(angle))
          const outerX = CX + OUTER_R * Math.cos(toRad(angle))
          const outerY = CY + OUTER_R * Math.sin(toRad(angle))
          return (
            <line
              key={angle}
              x1={innerX}
              y1={innerY}
              x2={outerX}
              y2={outerY}
              stroke="#0B0F19"
              strokeWidth="2"
              style={{ pointerEvents: 'none' }}
            />
          )
        })}
      </svg>
    </div>
  )
}
