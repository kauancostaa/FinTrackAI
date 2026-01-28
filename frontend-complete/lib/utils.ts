import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateRandomId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function calculateRiskScore(factors: any[]): number {
  // Lógica simplificada de cálculo de risco
  const baseScore = 50
  const adjustments = factors.reduce((acc, factor) => {
    if (factor.severity === 'high') acc -= 20
    if (factor.severity === 'medium') acc -= 10
    if (factor.severity === 'low') acc -= 5
    return acc
  }, 0)
  return Math.max(0, Math.min(100, baseScore + adjustments))
}
