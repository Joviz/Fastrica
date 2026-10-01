import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Cable, AlertTriangle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { ResultDisplay } from '@/components/ui/ResultDisplay'
import { calcBitola } from '@/lib/bitolas'
import { useCalculo } from '@/context/CalculoContext'

// ======================
// Validation schema
// ======================
const schema = z.object({
  corrente: z
    .string()
    .min(1, 'Campo obrigatório')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Deve ser maior que 0'),
  distancia: z
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
// Tabela de disjuntores sugeridos por corrente ajustada
// ======================
function disjuntorSugerido(correnteAjustada: number): string {
  if (correnteAjustada <= 10)  return '10A Curva C'
  if (correnteAjustada <= 16)  return '16A Curva C'
  if (correnteAjustada <= 20)  return '20A Curva C'
  if (correnteAjustada <= 25)  return '25A Curva C'
  if (correnteAjustada <= 32)  return '32A Curva C'
  if (correnteAjustada <= 40)  return '40A Curva C'
  if (correnteAjustada <= 50)  return '50A Curva C'
  if (correnteAjustada <= 63)  return '63A Curva C'
  if (correnteAjustada <= 80)  return '80A Curva C'
  return '100A+ (consulte engenheiro)'
}

// ======================
// Component
// ======================
/**
 * BitolaCabo — Calculadora de bitola de cabo NBR 5410.
 * Novidades:
 * - Chips de tensão padrão Brasil (127V / 220V / 380V)
 * - Barra visual de queda de tensão (gradiente semafórico)
 * - Disjuntor recomendado junto ao resultado
 * - Alerta redesenhado com Lucide icons
 */
export function BitolaCabo(): React.JSX.Element {
  const [result, setResult] = useState<ReturnType<typeof calcBitola> | null>(null)
  const [lastCorrente, setLastCorrente] = useState(0)
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
    const corrente  = parseFloat(data.corrente)
    const distancia = parseFloat(data.distancia)
    const tensao    = parseFloat(data.tensao)
    const calc      = calcBitola(corrente, distancia, tensao)
    setResult(calc)
    setLastCorrente(corrente)
    if (calc.bitola) {
      setUltimoCalculo({
        tipo: 'bitola',
        bitola: calc.bitola.label,
        corrente: calc.corrente_ajustada,
      })
    }
  }

  // Cores semafóricas para queda de tensão
  const quedaColor =
    !result ? '#475569'
    : result.queda_tensao > 4   ? '#F87171'
    : result.queda_tensao > 2   ? '#F59E0B'
    : '#34D399'

  const quedaLabel =
    !result ? ''
    : result.queda_tensao > 4 ? 'Reprovado (> 4%)'
    : result.queda_tensao > 2 ? 'Atenção (2–4%)'
    : 'Excelente (< 2%)'

  // Barra de conformidade: 0–5% mapeado para 0–100%
  const quedaBarWidth = result ? Math.min((result.queda_tensao / 5) * 100, 100) : 0

  return (
    <Card
      title="Bitola de Cabo"
      icon={<Cable size={18} />}
      accentColor="#A78BFA"
    >
      {/* Chips de tensão padrão Brasil */}
      <div className="mb-3">
        <p className="text-xs text-[#475569] mb-2">Tensão padrão</p>
        <div className="flex gap-2">
          {['127', '220', '380'].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setValue('tensao', v)}
              className="px-3 py-1.5 text-xs font-mono rounded-lg border border-[#243451] bg-[#0F1625] text-[#94A3B8] hover:border-[#A78BFA]/60 hover:text-[#A78BFA] hover:bg-[#A78BFA]/8 transition-all duration-150"
            >
              {v}V
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input
          label="Corrente máxima (A)"
          placeholder="Ex: 10"
          type="number"
          step="any"
          min="0"
          unit="A"
          error={errors.corrente?.message}
          {...register('corrente')}
        />

        <Input
          label="Distância do circuito (m)"
          placeholder="Ex: 20"
          type="number"
          step="any"
          min="0"
          unit="m"
          error={errors.distancia?.message}
          {...register('distancia')}
        />

        <Input
          label="Tensão de uso (V)"
          placeholder="127 ou 220"
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
          style={{ backgroundColor: '#A78BFA', boxShadow: '0 0 16px rgba(167,139,250,0.3)' }}
        >
          Calcular Bitola
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
            {result.bitola ? (
              <>
                <ResultDisplay
                  value={result.bitola.cross}
                  unit="mm²"
                  label="Bitola Recomendada (NBR 5410)"
                  formula={`I = ${lastCorrente}A × 1.25 = ${result.corrente_ajustada.toFixed(1)}A`}
                  accentColor="#A78BFA"
                  size="md"
                />

                {/* Disjuntor recomendado */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#0F1625] border border-[#A78BFA]/20">
                  <CheckCircle size={14} className="text-[#A78BFA] shrink-0" />
                  <div>
                    <span className="text-xs text-[#475569]">Disjuntor sugerido: </span>
                    <span className="text-xs font-semibold text-[#A78BFA] font-mono">
                      {disjuntorSugerido(result.corrente_ajustada)}
                    </span>
                  </div>
                </div>

                {/* Barra de conformidade NBR — semafórica */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#475569]">Queda de Tensão</span>
                    <span className="text-xs font-mono font-semibold" style={{ color: quedaColor }}>
                      {result.queda_tensao.toFixed(2)}% — {quedaLabel}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#0F1625] border border-[#1E293B] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: result.queda_tensao > 4
                          ? '#F87171'
                          : result.queda_tensao > 2
                            ? 'linear-gradient(90deg, #34D399, #F59E0B)'
                            : '#34D399',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${quedaBarWidth}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#334155] font-mono">
                    <span>0%</span>
                    <span className="text-[#34D399]">2%</span>
                    <span className="text-[#F59E0B]">4%</span>
                    <span className="text-[#F87171]">5%+</span>
                  </div>
                </div>

                {/* Grid capacidade + corrente ajustada */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-[#0F1625] rounded-xl border border-[#1E293B]">
                    <p className="text-xs text-[#475569] mb-1">Capacidade do Cabo</p>
                    <p className="text-base font-bold font-mono text-[#A78BFA]">
                      {result.bitola.maxCurrent} A
                    </p>
                  </div>
                  <div className="p-3 bg-[#0F1625] rounded-xl border border-[#1E293B]">
                    <p className="text-xs text-[#475569] mb-1">Corrente Ajustada</p>
                    <p className="text-base font-bold font-mono text-[#94A3B8]">
                      {result.corrente_ajustada.toFixed(1)} A
                    </p>
                  </div>
                </div>

                {/* Alerta queda > 4% */}
                {result.queda_tensao > 4 && (
                  <motion.div
                    className="flex gap-2.5 p-3 rounded-xl bg-[#F87171]/8 border border-[#F87171]/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <AlertTriangle size={14} className="text-[#F87171] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#F87171] leading-relaxed">
                      Queda acima de 4% (limite NBR 5410). Considere usar <strong>{
                        (() => {
                          const idx = [1.5,2.5,4,6,10,16,25,35,50,70,95,120].indexOf(result.bitola?.cross ?? 0)
                          return [1.5,2.5,4,6,10,16,25,35,50,70,95,120][idx + 1]
                        })()
                      } mm²</strong> ou reduzir a distância.
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="p-4 rounded-xl bg-[#F87171]/8 border border-[#F87171]/30 flex gap-2.5">
                <AlertTriangle size={14} className="text-[#F87171] shrink-0 mt-0.5" />
                <p className="text-sm text-[#F87171]">
                  Corrente muito alta para a tabela disponível. Consulte um engenheiro eletricista.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
