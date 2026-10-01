export interface Bitola {
  cross: number
  maxCurrent: number
  label: string
}

export const bitolaTable: Bitola[] = [
  { cross: 1.5,  maxCurrent: 15.5, label: '1,5 mm²' },
  { cross: 2.5,  maxCurrent: 21,   label: '2,5 mm²' },
  { cross: 4,    maxCurrent: 28,   label: '4 mm²'   },
  { cross: 6,    maxCurrent: 36,   label: '6 mm²'   },
  { cross: 10,   maxCurrent: 50,   label: '10 mm²'  },
  { cross: 16,   maxCurrent: 68,   label: '16 mm²'  },
  { cross: 25,   maxCurrent: 89,   label: '25 mm²'  },
  { cross: 35,   maxCurrent: 110,  label: '35 mm²'  },
  { cross: 50,   maxCurrent: 134,  label: '50 mm²'  },
  { cross: 70,   maxCurrent: 171,  label: '70 mm²'  },
  { cross: 95,   maxCurrent: 207,  label: '95 mm²'  },
  { cross: 120,  maxCurrent: 239,  label: '120 mm²' },
]

export function calcBitola(
  corrente: number,
  distancia: number,
  tensao: number
): { bitola: Bitola | null; corrente_ajustada: number; queda_tensao: number } {
  const corrente_ajustada = corrente * 1.25

  const bitola = bitolaTable.find((b) => b.maxCurrent >= corrente_ajustada) ?? null

  const queda_tensao = bitola
    ? (2 * 0.0175 * distancia * corrente) / (bitola.cross * tensao) * 100
    : 0

  return { bitola, corrente_ajustada, queda_tensao }
}
