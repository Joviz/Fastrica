import React, { useState, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { ResultDisplay } from '@/components/ui/ResultDisplay'
import { calcP_fromVI } from '@/lib/formulas'

const schema = z.object({
  tensao: z
    .string()
    .min(1, 'Campo obrigatório')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Deve ser maior que 0'),
  corrente: z
    .string()
    .min(1, 'Campo obrigatório')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Deve ser maior que 0'),
})

type FormData = z.infer<typeof schema>

export function Potencia(): React.JSX.Element {
  const [result, setResult] = useState<number | null>(null)

  const {
    register,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const tensaoVal = useWatch({ control, name: 'tensao' })
  const correnteVal = useWatch({ control, name: 'corrente' })

  useEffect(() => {
    const V = parseFloat(tensaoVal ?? '')
    const I = parseFloat(correnteVal ?? '')
    if (!isNaN(V) && !isNaN(I) && V > 0 && I > 0) {
      setResult(calcP_fromVI(V, I))
    } else {
      setResult(null)
    }
  }, [tensaoVal, correnteVal])

  return (
    <Card
      title="Potência"
      icon={<Zap size={18} />}
      accentColor="#34D399"
    >
      <div className="space-y-3">
        <Input
          label="Tensão (V)"
          placeholder="Ex: 220"
          type="number"
          step="any"
          min="0"
          unit="V"
          error={errors.tensao?.message}
          {...register('tensao')}
        />

        <Input
          label="Corrente (A)"
          placeholder="Ex: 5"
          type="number"
          step="any"
          min="0"
          unit="A"
          error={errors.corrente?.message}
          {...register('corrente')}
        />

        <ResultDisplay
          value={result}
          unit="W"
          label="Potência Calculada"
          formula="P = V × I"
          accentColor="#34D399"
          size="md"
        />

        {result !== null && (
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 bg-[#0F1625] rounded-xl border border-[#1E293B]">
              <p className="text-xs text-[#475569] mb-0.5">kW</p>
              <p className="text-sm font-mono text-[#94A3B8] font-semibold">
                {(result / 1000).toFixed(4)}
              </p>
            </div>
            <div className="p-2 bg-[#0F1625] rounded-xl border border-[#1E293B]">
              <p className="text-xs text-[#475569] mb-0.5">kWh/dia (8h)</p>
              <p className="text-sm font-mono text-[#94A3B8] font-semibold">
                {((result * 8) / 1000).toFixed(3)}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
