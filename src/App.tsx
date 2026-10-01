import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CircleSelector } from '@/components/CircleSelector'
import { OhmModal } from '@/components/ModalFormula'
import { FonteLED } from '@/components/Calculators/FonteLED'
import { BitolaCabo } from '@/components/Calculators/BitolaCabo'
import { Potencia } from '@/components/Calculators/Potencia'
import { grandezaInfo } from '@/types'
import type { ModalType } from '@/types'
import { Zap, HelpCircle, ShoppingCart } from 'lucide-react'
import { HelpModal } from '@/components/HelpModal'
import { useCalculo, abrirBusca } from '@/context/CalculoContext'

function Header({ onHelpOpen }: { onHelpOpen: () => void }): React.JSX.Element {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B]/60">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#22D3EE]/15 border border-[#22D3EE]/30">
          <Zap size={16} className="text-[#22D3EE]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#F1F5F9] leading-none tracking-tight">
            Fastrica
          </h1>
          <p className="text-[10px] text-[#475569] leading-none mt-0.5 tracking-wider uppercase">
            Calculadora Elétrica
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onHelpOpen}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-[#475569] hover:text-[#94A3B8] hover:bg-[#141B2D] transition-all duration-150"
          aria-label="Ajuda"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </header>
  )
}

function GrandezaStrip({ selected }: { selected: ModalType }): React.JSX.Element {
  const grandezas = ['V', 'I', 'R', 'P'] as const

  return (
    <div className="flex gap-2 flex-wrap">
      {grandezas.map((g) => {
        const info = grandezaInfo[g]
        const isActive = selected === g
        return (
          <motion.div
            key={g}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            animate={{
              borderColor: isActive ? info.color : '#1E293B',
              backgroundColor: isActive ? `${info.color}15` : 'transparent',
              color: isActive ? info.color : '#475569',
            }}
            transition={{ duration: 0.2 }}
          >
            <span className="font-bold">{g}</span>
            <span className="opacity-70">{info.unit.split(' ')[0]}</span>
          </motion.div>
        )
      })}
    </div>
  )
}

function App(): React.JSX.Element {
  const [activeModal, setActiveModal] = useState<NonNullable<ModalType> | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const { ultimoCalculo } = useCalculo()

  function handleSectorSelect(type: NonNullable<ModalType>) {
    setActiveModal((prev) => (prev === type ? null : type))
  }

  function handleModalClose() {
    setActiveModal(null)
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col">
      <Header onHelpOpen={() => setHelpOpen(true)} />

      <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-auto">

        <div className="flex-1 flex flex-col items-center justify-start pt-8 lg:pt-12 p-6 lg:p-10 lg:border-r lg:border-[#1E293B]/60 min-h-[60vh] lg:min-h-0">

          <div className="text-center mb-8 lg:mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#F1F5F9] mb-2">
              Lei de Ohm
            </h2>
            <p className="text-sm text-[#475569] max-w-xs mx-auto">
              Clique em um setor para calcular a grandeza elétrica correspondente
            </p>
          </div>

          <motion.div
            className="relative w-full max-w-[520px] lg:max-w-[620px] xl:max-w-[680px] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
          >
            <CircleSelector
              selected={activeModal}
              onSelect={handleSectorSelect}
              size={undefined}
              className="drop-shadow-2xl w-full h-auto"
            />
          </motion.div>

          <motion.div
            className="mt-6 lg:mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {activeModal ? (
                <motion.div
                  key={activeModal}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-2"
                >
                  <p
                    className="text-sm font-semibold"
                    style={{ color: grandezaInfo[activeModal].color }}
                  >
                    {grandezaInfo[activeModal].name} ({grandezaInfo[activeModal].symbol})
                  </p>
                  <p className="text-xs text-[#475569]">
                    {grandezaInfo[activeModal].description}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="instruction"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GrandezaStrip selected={activeModal} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 p-4 lg:p-6 xl:p-8 flex flex-col gap-4 overflow-y-auto">

          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-[#475569] uppercase tracking-wider">
              Calculadoras
            </h3>
            <span className="text-xs text-[#243451] font-mono">3 ferramentas</span>
          </div>

          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.15 }}
          >
            <FonteLED />
            <BitolaCabo />
            <Potencia />
          </motion.div>

          <motion.button
            onClick={() => abrirBusca(ultimoCalculo)}
            disabled={!ultimoCalculo}
            className="w-full mt-2 flex items-center justify-center gap-2 h-11 rounded-xl border border-dashed border-[#243451] text-[#475569] text-sm font-medium hover:border-[#22D3EE]/40 hover:text-[#94A3B8] hover:bg-[#141B2D] transition-all duration-200 group disabled:opacity-40 disabled:cursor-not-allowed"
            whileHover={ultimoCalculo ? { scale: 1.01 } : {}}
            whileTap={ultimoCalculo ? { scale: 0.99 } : {}}
          >
            <ShoppingCart size={15} className="text-[#22D3EE]/60 group-hover:text-[#22D3EE] transition-colors" />
            O que comprar?
          </motion.button>

          <p className="text-center text-[10px] text-[#243451] pb-2">
            Cálculos baseados na NBR 5410 · Use com discernimento
          </p>
        </div>
      </main>

      {activeModal && (
        <OhmModal
          grandeza={activeModal}
          isOpen={true}
          onClose={handleModalClose}
        />
      )}

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}

export default App
