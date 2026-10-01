export function calcI_fromVR(V: number, R: number): number {
  return V / R
}

export function calcI_fromPV(P: number, V: number): number {
  return P / V
}

export function calcI_fromPR(P: number, R: number): number {
  return Math.sqrt(P / R)
}

export function calcV_fromIR(I: number, R: number): number {
  return I * R
}

export function calcV_fromPI(P: number, I: number): number {
  return P / I
}

export function calcV_fromPR(P: number, R: number): number {
  return Math.sqrt(P * R)
}

export function calcR_fromVI(V: number, I: number): number {
  return V / I
}

export function calcR_fromVP(V: number, P: number): number {
  return (V * V) / P
}

export function calcR_fromPI(P: number, I: number): number {
  return P / (I * I)
}

export function calcP_fromVI(V: number, I: number): number {
  return V * I
}

export function calcP_fromIR(I: number, R: number): number {
  return I * I * R
}

export function calcP_fromVR(V: number, R: number): number {
  return (V * V) / R
}

export type Grandeza = 'V' | 'I' | 'R' | 'P'

export interface FormulaOption {
  id: string
  label: string
  formula: string
  inputs: { name: string; label: string; unit: string }[]
  calculate: (values: Record<string, number>) => number
}

export const formulasMap: Record<Grandeza, FormulaOption[]> = {
  I: [
    {
      id: 'I_VR',
      label: 'I = V / R',
      formula: 'I = V ÷ R',
      inputs: [
        { name: 'V', label: 'Tensão', unit: 'V' },
        { name: 'R', label: 'Resistência', unit: 'Ω' },
      ],
      calculate: (v) => calcI_fromVR(v.V, v.R),
    },
    {
      id: 'I_PV',
      label: 'I = P / V',
      formula: 'I = P ÷ V',
      inputs: [
        { name: 'P', label: 'Potência', unit: 'W' },
        { name: 'V', label: 'Tensão', unit: 'V' },
      ],
      calculate: (v) => calcI_fromPV(v.P, v.V),
    },
    {
      id: 'I_PR',
      label: 'I = √(P/R)',
      formula: 'I = √(P ÷ R)',
      inputs: [
        { name: 'P', label: 'Potência', unit: 'W' },
        { name: 'R', label: 'Resistência', unit: 'Ω' },
      ],
      calculate: (v) => calcI_fromPR(v.P, v.R),
    },
  ],
  V: [
    {
      id: 'V_IR',
      label: 'V = I × R',
      formula: 'V = I × R',
      inputs: [
        { name: 'I', label: 'Corrente', unit: 'A' },
        { name: 'R', label: 'Resistência', unit: 'Ω' },
      ],
      calculate: (v) => calcV_fromIR(v.I, v.R),
    },
    {
      id: 'V_PI',
      label: 'V = P / I',
      formula: 'V = P ÷ I',
      inputs: [
        { name: 'P', label: 'Potência', unit: 'W' },
        { name: 'I', label: 'Corrente', unit: 'A' },
      ],
      calculate: (v) => calcV_fromPI(v.P, v.I),
    },
    {
      id: 'V_PR',
      label: 'V = √(P×R)',
      formula: 'V = √(P × R)',
      inputs: [
        { name: 'P', label: 'Potência', unit: 'W' },
        { name: 'R', label: 'Resistência', unit: 'Ω' },
      ],
      calculate: (v) => calcV_fromPR(v.P, v.R),
    },
  ],
  R: [
    {
      id: 'R_VI',
      label: 'R = V / I',
      formula: 'R = V ÷ I',
      inputs: [
        { name: 'V', label: 'Tensão', unit: 'V' },
        { name: 'I', label: 'Corrente', unit: 'A' },
      ],
      calculate: (v) => calcR_fromVI(v.V, v.I),
    },
    {
      id: 'R_VP',
      label: 'R = V² / P',
      formula: 'R = V² ÷ P',
      inputs: [
        { name: 'V', label: 'Tensão', unit: 'V' },
        { name: 'P', label: 'Potência', unit: 'W' },
      ],
      calculate: (v) => calcR_fromVP(v.V, v.P),
    },
    {
      id: 'R_PI',
      label: 'R = P / I²',
      formula: 'R = P ÷ I²',
      inputs: [
        { name: 'P', label: 'Potência', unit: 'W' },
        { name: 'I', label: 'Corrente', unit: 'A' },
      ],
      calculate: (v) => calcR_fromPI(v.P, v.I),
    },
  ],
  P: [
    {
      id: 'P_VI',
      label: 'P = V × I',
      formula: 'P = V × I',
      inputs: [
        { name: 'V', label: 'Tensão', unit: 'V' },
        { name: 'I', label: 'Corrente', unit: 'A' },
      ],
      calculate: (v) => calcP_fromVI(v.V, v.I),
    },
    {
      id: 'P_IR',
      label: 'P = I² × R',
      formula: 'P = I² × R',
      inputs: [
        { name: 'I', label: 'Corrente', unit: 'A' },
        { name: 'R', label: 'Resistência', unit: 'Ω' },
      ],
      calculate: (v) => calcP_fromIR(v.I, v.R),
    },
    {
      id: 'P_VR',
      label: 'P = V² / R',
      formula: 'P = V² ÷ R',
      inputs: [
        { name: 'V', label: 'Tensão', unit: 'V' },
        { name: 'R', label: 'Resistência', unit: 'Ω' },
      ],
      calculate: (v) => calcP_fromVR(v.V, v.R),
    },
  ],
}
