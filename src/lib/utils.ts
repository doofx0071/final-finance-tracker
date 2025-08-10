import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatting utilities for Philippine Peso
export const formatCurrency = (amount: number, locale = 'en-PH'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const parseCurrency = (value: string): number => {
  // Remove PHP symbol and commas, parse as float
  return parseFloat(value.replace(/[₱,\s]/g, '')) || 0
}

export const formatCompactCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    notation: 'compact',
    compactDisplay: 'short',
  }).format(amount)
}
