export type { Grandeza } from '@/lib/formulas'

export type ModalType = 'V' | 'I' | 'R' | 'P' | null

export interface GrandezaInfo {
  symbol: string
  name: string
  unit: string
  color: string
  colorDim: string
  description: string
}

export const grandezaInfo: Record<NonNullable<ModalType>, GrandezaInfo> = {
  V: {
    symbol: 'V',
    name: 'Tensão',
    unit: 'Volts',
    color: '#22D3EE',
    colorDim: '#0891B2',
    description: 'Diferença de potencial elétrico',
  },
  I: {
    symbol: 'I',
    name: 'Corrente',
    unit: 'Amperes',
    color: '#F59E0B',
    colorDim: '#D97706',
    description: 'Fluxo de carga elétrica',
  },
  R: {
    symbol: 'R',
    name: 'Resistência',
    unit: 'Ohms (Ω)',
    color: '#A78BFA',
    colorDim: '#7C3AED',
    description: 'Oposição ao fluxo de corrente',
  },
  P: {
    symbol: 'P',
    name: 'Potência',
    unit: 'Watts',
    color: '#34D399',
    colorDim: '#059669',
    description: 'Taxa de transferência de energia',
  },
}

export type CalculatorType = 'fonte-led' | 'bitola-cabo' | 'potencia'
