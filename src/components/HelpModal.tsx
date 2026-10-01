import React from 'react'
import { Modal } from '@/components/ui/Modal'
import { HelpCircle, Zap, Cable, Lightbulb, BookOpen } from 'lucide-react'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * HelpModal - Modal de ajuda com explicação de todas as funcionalidades.
 */
export function HelpModal({ isOpen, onClose }: HelpModalProps): React.JSX.Element {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajuda & Guia Rápido"
      subtitle="Como usar o Fastrica"
      accentColor="#22D3EE"
      icon={<HelpCircle size={18} />}
      size="md"
    >
      <div className="space-y-5">

        {/* Lei de Ohm section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-[#22D3EE]" />
            <h3 className="text-sm font-semibold text-[#F1F5F9]">Círculo da Lei de Ohm</h3>
          </div>
          <div className="bg-[#0F1625] rounded-xl p-4 border border-[#1E293B] space-y-2">
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              O círculo central representa as 4 grandezas elétricas da Lei de Ohm. Clique em qualquer setor para abrir a calculadora daquela grandeza.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                { symbol: 'V', name: 'Tensão', unit: 'Volts', color: '#22D3EE' },
                { symbol: 'I', name: 'Corrente', unit: 'Amperes', color: '#F59E0B' },
                { symbol: 'R', name: 'Resistência', unit: 'Ohms', color: '#A78BFA' },
                { symbol: 'P', name: 'Potência', unit: 'Watts', color: '#34D399' },
              ].map((g) => (
                <div
                  key={g.symbol}
                  className="flex items-center gap-2 p-2 rounded-lg"
                  style={{ backgroundColor: `${g.color}10`, border: `1px solid ${g.color}30` }}
                >
                  <span className="font-bold text-sm font-mono" style={{ color: g.color }}>
                    {g.symbol}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-[#F1F5F9] leading-none">{g.name}</p>
                    <p className="text-[10px] text-[#475569] leading-none mt-0.5">{g.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calculadoras section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} className="text-[#22D3EE]" />
            <h3 className="text-sm font-semibold text-[#F1F5F9]">Calculadoras Laterais</h3>
          </div>
          <div className="space-y-2">
            <div className="bg-[#0F1625] rounded-xl p-3 border border-[#1E293B] flex gap-3">
              <Lightbulb size={16} className="text-[#F59E0B] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#F1F5F9] mb-0.5">Fonte para LED</p>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Calcula a fonte de alimentação ideal para fitas de LED com margem de segurança de 25%.
                </p>
              </div>
            </div>
            <div className="bg-[#0F1625] rounded-xl p-3 border border-[#1E293B] flex gap-3">
              <Cable size={16} className="text-[#A78BFA] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#F1F5F9] mb-0.5">Bitola de Cabo</p>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Recomenda a bitola de cabo baseada na NBR 5410, considerando corrente, distância e queda de tensão.
                </p>
              </div>
            </div>
            <div className="bg-[#0F1625] rounded-xl p-3 border border-[#1E293B] flex gap-3">
              <Zap size={16} className="text-[#34D399] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#F1F5F9] mb-0.5">Potência</p>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Calcula a potência elétrica em tempo real. Resultado em W, kW e kWh/dia.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/20">
          <p className="text-xs text-[#F59E0B]/80 text-center leading-relaxed">
            ⚠️ Os cálculos são estimativas. Para instalações elétricas reais, consulte sempre um eletricista habilitado.
          </p>
        </div>
      </div>
    </Modal>
  )
}
