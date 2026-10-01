import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lightbulb, AlertTriangle, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useCalculo } from '@/context/CalculoContext'

// ======================
// Validation schema
// ======================
const schema = z.object({
  quantidade: z
    .string()
    .min(1, 'Campo obrigatório')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Deve ser maior que 0'),
  potenciaPorMetro: z
    .string()
    .min(1, 'Campo obrigatório')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Deve ser maior que 0'),
  tensao: z
    .string()
    .min(1, 'Campo obrigatório')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Deve ser maior que 0'),
})

type FormData = z.infer<typeof schema>

// ======================
// Presets de fitas LED comuns no mercado BR
// ======================
const LED_PRESETS = [
  { label: 'SMD 2835', wPerM: 9.6 },
  { label: 'SMD 5050', wPerM: 14.4 },
  { label: 'COB', wPerM: 12 },
  { label: 'Neon LED', wPerM: 10 },
]

// ======================
// Business logic
// ======================
const FONT_SIZES = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100, 120, 150, 180, 200, 250, 300, 350, 400, 500]

interface FonteLEDResult {
  potenciaTotal: number
  potenciaComMargem: number
  fonteSugerida: number
  corrente: number
  correnteComMargem: number
  tensao: number
  metros: number
}

function calcFonteLED(quantidade: number, potenciaPorMetro: number, tensaoFonte: number): FonteLEDResult {
  const potenciaTotal     = quantidade * potenciaPorMetro
  const potenciaComMargem = potenciaTotal * 1.25
  const corrente          = potenciaTotal / tensaoFonte
  const correnteComMargem = potenciaComMargem / tensaoFonte
  const fonteSugerida     = FONT_SIZES.find((s) => s >= potenciaComMargem) ?? Math.ceil(potenciaComMargem / 50) * 50
  return { potenciaTotal, potenciaComMargem, fonteSugerida, corrente, correnteComMargem, tensao: tensaoFonte, metros: quantidade }
}

// ======================
// Component
// ======================
/**
 * FonteLED — Calculadora de fonte para fitas LED.
 * Novidades:
 * - Presets rápidos (SMD 2835, SMD 5050, COB, Neon LED)
 * - Alerta de injeção dupla para fitas > 5m em tensões ≤ 12V
 * - Destaque W·A para compra direta
 * - Grid de métricas com tokens Fastrica (#0F1625)
 */
export function FonteLED(): React.JSX.Element {
  const [result, setResult] = useState<FonteLEDResult | null>(null)
  const { setUltimoCalculo } = useCalculo()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: FormData) {
    const calc = calcFonteLED(parseFloat(data.quantidade), parseFloat(data.potenciaPorMetro), parseFloat(data.tensao))
    setResult(calc)
    setUltimoCalculo({
      tipo: 'fonte',
      potencia: Math.round(calc.potenciaComMargem),
      corrente: calc.correnteComMargem,
      tensao: calc.tensao,
    })
  }

  // Alerta injeção dupla: > 5m em tensão baixa (≤ 24V)
  const showInjecaoDupla = result && result.metros > 5 && result.tensao <= 24

  const correnteDisplay =
    result
      ? result.correnteComMargem < 1
        ? result.correnteComMargem.toFixed(1)
        : String(Math.ceil(result.correnteComMargem))
      : '—'

  return (
    <Card
      title="Fonte para LED"
      icon={<Lightbulb size={18} />}
      accentColor="#F59E0B"
    >
      {/* Presets de fitas */}
      <div className="mb-3">
        <p className="text-xs text-[#475569] mb-2">Preset rápido (W/m)</p>
        <div className="flex flex-wrap gap-1.5">
          {LED_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setValue('potenciaPorMetro', String(preset.wPerM))}
              className="px-2.5 py-1 text-xs rounded-lg border border-[#243451] bg-[#0F1625] text-[#94A3B8] hover:border-[#F59E0B]/60 hover:text-[#F59E0B] hover:bg-[#F59E0B]/8 transition-all duration-150 font-mono"
            >
              {preset.label} · {preset.wPerM}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input
          label="Quantidade de fita (m)"
          placeholder="Ex: 5"
          type="number"
          step="any"
          min="0"
          unit="m"
          error={errors.quantidade?.message}
          {...register('quantidade')}
        />

        <Input
          label="Potência por metro (W/m)"
          placeholder="Ex: 14.4"
          type="number"
          step="any"
          min="0"
          unit="W/m"
          error={errors.potenciaPorMetro?.message}
          {...register('potenciaPorMetro')}
        />

        <Input
          label="Tensão da fonte (V)"
          placeholder="12 ou 24"
          type="number"
          step="any"
          min="0"
          unit="V"
          error={errors.tensao?.message}
          {...register('tensao')}
        />

        <button
          type="submit"
          className="w-full h-10 rounded-xl text-sm font-semibold text-[#0B0F19] transition-all duration-200 active:scale-[0.98] hover:brightness-110"
          style={{ backgroundColor: '#F59E0B', boxShadow: '0 0 16px rgba(245,158,11,0.3)' }}
        >
          Calcular Fonte
        </button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div
            className="mt-4 space-y-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Destaque principal W · A */}
            <div
              className="relative rounded-2xl border border-[#243451] overflow-hidden bg-gradient-to-br from-[#0F1625] to-[#141B2D] p-5"
              style={{ boxShadow: '0 0 20px rgba(245,158,11,0.12), inset 0 0 40px rgba(245,158,11,0.05)' }}
            >
              <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 30% 50%, #F59E0B, transparent 65%)' }}
              />

              <p className="text-xs text-[#475569] mb-3 uppercase tracking-wider">Fonte Sugerida</p>

              <div className="flex items-end gap-4 mb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-mono tracking-tight text-[#F1F5F9]">
                    {result.fonteSugerida}
                  </span>
                  <span className="text-xl font-semibold text-[#F59E0B]">W</span>
                </div>
                <span className="text-[#334155] text-2xl font-light mb-0.5">·</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-mono tracking-tight text-[#F1F5F9]">
                    {correnteDisplay}
                  </span>
                  <span className="text-xl font-semibold text-[#22D3EE]">A</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#1E293B]">
                <Zap size={11} className="text-[#F59E0B] shrink-0" />
                <p className="text-xs font-mono text-[#F59E0B]">
                  Fonte {result.tensao}V · {result.fonteSugerida}W · {correnteDisplay}A mínimo
                </p>
              </div>
            </div>

            {/* Alerta injeção dupla */}
            {showInjecaoDupla && (
              <motion.div
                className="flex gap-2.5 p-3 rounded-xl bg-[#F59E0B]/8 border border-[#F59E0B]/30"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertTriangle size={15} className="text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[#F59E0B] mb-0.5">Dica de Instalação</p>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Para fitas acima de 5m em {result.tensao}V, alimente as <strong className="text-[#F1F5F9]">duas pontas</strong> da fita para evitar queda de brilho no final.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Grid 2×2 métricas */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Corrente Total', value: `${result.corrente.toFixed(2)} A`, color: '#22D3EE' },
                { label: 'Corrente c/ Margem', value: `${result.correnteComMargem.toFixed(2)} A`, color: '#22D3EE' },
                { label: 'Potência Total', value: `${result.potenciaTotal.toFixed(1)} W`, color: '#F59E0B' },
                { label: 'Potência c/ Margem', value: `${result.potenciaComMargem.toFixed(1)} W`, color: '#F59E0B' },
              ].map((item) => (
                <div key={item.label} className="bg-[#0F1625] rounded-xl p-3 border border-[#1E293B]">
                  <p className="text-xs text-[#475569] mb-1">{item.label}</p>
                  <p className="text-base font-bold font-mono" style={{ color: item.color }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
