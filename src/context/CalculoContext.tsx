import React, { createContext, useContext, useState } from 'react'

export type UltimoCalculo =
  | { tipo: 'fonte'; potencia: number; corrente: number; tensao: number }
  | { tipo: 'bitola'; bitola: string; corrente: number }
  | null

interface CalculoContextValue {
  ultimoCalculo: UltimoCalculo
  setUltimoCalculo: (calculo: UltimoCalculo) => void
}

const CalculoContext = createContext<CalculoContextValue | undefined>(undefined)

export function CalculoProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [ultimoCalculo, setUltimoCalculo] = useState<UltimoCalculo>(null)

  return (
    <CalculoContext.Provider value={{ ultimoCalculo, setUltimoCalculo }}>
      {children}
    </CalculoContext.Provider>
  )
}

export function useCalculo(): CalculoContextValue {
  const ctx = useContext(CalculoContext)
  if (!ctx) {
    throw new Error('useCalculo must be used inside <CalculoProvider>')
  }
  return ctx
}

export function abrirBusca(calculo: UltimoCalculo): void {
  if (!calculo) return

  let query: string
  if (calculo.tipo === 'fonte') {
    query = `fonte ${calculo.tensao}V ${calculo.potencia}W ${calculo.corrente.toFixed(1)}A`
  } else {
    query = `cabo ${calculo.bitola} ${calculo.corrente.toFixed(1)}A`
  }
  const full = `${query} loja de material elétrico`
  const url = `https://www.google.com/search?q=${encodeURIComponent(full)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
