import { contactConfig } from '../config/contact'

const CITY_ALIASES: Record<string, string> = {
  gurugram: 'Gurgaon',
  'new delhi': 'Delhi',
  ncr: 'Delhi',
}

export function normalizeCityInput(input: string): string {
  return input.trim().replace(/\s+/g, ' ')
}

export function resolveServingCity(input: string): string | null {
  const normalized = normalizeCityInput(input).toLowerCase()
  if (!normalized) return null

  const alias = CITY_ALIASES[normalized]
  if (alias) return alias

  const match = contactConfig.servingCities.find(
    (city) => city.toLowerCase() === normalized,
  )
  return match ?? null
}

export function isServingCity(input: string): boolean {
  return resolveServingCity(input) !== null
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}
