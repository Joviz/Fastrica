import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { ResultDisplay } from '@/components/ui/ResultDisplay'
import { formulasMap } from '@/lib/formulas'
import { grandezaInfo } from '@/types'
import { formatNumber } from '@/lib/utils'
import type { ModalType } from '@/types'
import type { FormulaOption } from '@/lib/formulas'
import { cn } from '@/lib/utils'

interface OhmModalProps {
  grandeza: NonNullable<ModalType>
  isOpen: boolean
  onClose: () => void
}

export function OhmModal({ grandeza, isOpen, onClose }: OhmModalProps): React.JSX.Element {
  const info = grandezaInfo[grandeza]
  const formulas = formulasMap[grandeza]

  const [selectedFormulaId, setSelectedFormulaId] = useState<string>(formulas[0].id)
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [result, setResult] = useState<number | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  const selectedFormula: FormulaOption = formulas.find(f => f.id === selectedFormulaId) ?? formulas[0]

  useEffect(() => {
    setInputValues({})
    setResult(null)
    setHasCalculated(false)
  }, [selectedFormulaId, grandeza, isOpen])

  useEffect(() => {
    setSelectedFormulaId(formulasMap[grandeza][0].id)
  }, [grandeza])

  function calculate(values: Record<string, string>): number | null {
    const numericValues: Record<string, number> = {}
    for (const inp of selectedFormula.inputs) {
      const num = parseFloat(values[inp.name] ?? '')
      if (isNaN(num) || num <= 0) return null
      numericValues[inp.name] = num
    }
    const res = selectedFormula.calculate(numericValues)
    return isFinite(res) ? res : null
  }

  function handleInputChange(name: string, value: string) {
    const updated = { ...inputValues, [name]: value }
    setInputValues(updated)
    const allFilled = selectedFormula.inputs.every(
      inp => updated[inp.name]?.trim() !== ''
    )
    if (allFilled) {
      const calc = calculate(updated)
      setResult(calc)
      setHasCalculated(calc !== null)
    } else {
      setResult(null)
      setHasCalculated(false)
    }
  }

  function handleCalculate() {
    const calc = calculate(inputValues)
    if (calc !== null) {
      setResult(calc)
      setHasCalculated(true)
    }
  }

  const allInputsFilled = selectedFormula.inputs.every(
    inp => inputValues[inp.name]?.trim() !== '' && !isNaN(parseFloat(inputValues[inp.name] ?? ''))
  )

  const unitSymbol = grandeza === 'R' ? 'Ω' : info.unit.split(' ')[0]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${info.name} (${info.symbol})`}
      subtitle={info.description}
      accentColor={info.color}
      icon={<Zap size={18} />}
      size="md"
    >
      <div className="mb-5">
        <p className="text-xs text-[#475569] mb-2 uppercase tracking-wider font-medium">
          Escolha a fórmula
        </p>
        <div className="grid grid-cols-3 gap-2">
          {formulas.map((formula) => {
            const isSelected = selectedFormulaId === formula.id
            return (
              <button
                key={formula.id}
                onClick={() => setSelectedFormulaId(formula.id)}
                className={cn(
                  'px-3 py-3 rounded-lg border text-xs font-mono leading-tight',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-[#141B2D]',
                  isSelected
                    ? 'font-semibold'
                    : 'border-[#243451] bg-[#0F1625] text-[#475569] hover:border-[#334155] hover:text-[#94A3B8]'
                )}
                style={
                  isSelected
                    ? {
                        borderColor: info.color,
                        backgroundColor: `${info.color}15`,
                        color: info.color,
                        '--tw-ring-color': info.color,
                      }
                    : {}
                }
              >
                {formula.label}
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedFormulaId}
          className="space-y-3 mb-5"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.15 }}
        >
          {selectedFormula.inputs.map((inp) => (
            <Input
              key={inp.name}
              label={`${inp.label} (${inp.name})`}
              placeholder={`Digite em ${inp.unit}`}
              type="number"
              min="0"
              step="any"
              unit={inp.unit}
              value={inputValues[inp.name] ?? ''}
              onChange={(e) => handleInputChange(inp.name, e.target.value)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={handleCalculate}
        disabled={!allInputsFilled}
        className={cn(
          'w-full mb-5 h-10 rounded-xl text-sm font-semibold',
          'transition-all duration-200',
          'active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141B2D]',
          allInputsFilled
            ? 'text-[#0B0F19] cursor-pointer hover:brightness-110'
            : 'bg-[#1A233A] text-[#334155] border border-[#243451] cursor-not-allowed'
        )}
        style={
          allInputsFilled
            ? { backgroundColor: info.color, boxShadow: `0 0 16px ${info.color}40` }
            : {}
        }
      >
        Calcular {info.name}
      </button>

      <ResultDisplay
        value={hasCalculated ? result : null}
        unit={unitSymbol}
        label={`${info.name} (${info.symbol})`}
        formula={selectedFormula.formula}
        accentColor={info.color}
      />

      {hasCalculated && result !== null && (
        <motion.div
          className="mt-3 flex items-center justify-center gap-1.5 py-2"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-xs text-[#475569]">{info.symbol} =</span>
          <span
            className="text-sm font-mono font-bold"
            style={{ color: info.color }}
          >
            {formatNumber(result, 4)}
          </span>
          <span className="text-xs font-medium" style={{ color: `${info.color}99` }}>
            {unitSymbol}
          </span>
        </motion.div>
      )}
    </Modal>
  )
}
