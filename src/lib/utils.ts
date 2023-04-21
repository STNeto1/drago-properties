import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatPublishedAt(input: Date): string {
  const date = new Date(input)

  return `Published in ${date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'numeric'
  })} at ${date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  })}`
}

export function formatCurrency(input: number): string {
  return input.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
}
