import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number, decimals = 4): string {
  if (!isFinite(value) || isNaN(value)) return '—'
  const fixed = parseFloat(value.toFixed(decimals))
  return fixed.toString()
}

export function formatWithUnit(value: number, unit: string, decimals = 4): string {
  return `${formatNumber(value, decimals)} ${unit}`
}
