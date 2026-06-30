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

export interface GeocodedLocation {
  city: string
  pinCode: string | null
  address: string | null
  latitude: number
  longitude: number
}

function getDeviceCoordinates(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported on this device.'))
      return
    }

    if (!window.isSecureContext) {
      reject(
        new Error(
          'Location access needs a secure connection (HTTPS). Enter your city manually, or open the site on localhost.',
        ),
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error('Location permission denied. Allow location access in your browser settings.'))
          return
        }
        if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new Error('Unable to detect your location. Try again or enter your city manually.'))
          return
        }
        if (error.code === error.TIMEOUT) {
          reject(new Error('Location request timed out. Please try again.'))
          return
        }
        reject(new Error('Could not get your location.'))
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60_000 },
    )
  })
}

interface ReverseGeocodeResponse {
  city?: string
  locality?: string
  principalSubdivision?: string
  postcode?: string
}

async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodedLocation> {
  const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client')
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('localityLanguage', 'en')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Could not look up your address from GPS coordinates.')
  }

  const data = (await response.json()) as ReverseGeocodeResponse
  const city = normalizeCityInput(data.city || data.locality || data.principalSubdivision || '')

  if (!city) {
    throw new Error('Could not determine your city. Please enter it manually.')
  }

  const addressParts = [data.locality, data.city, data.principalSubdivision].filter(Boolean)
  const address = addressParts.length > 0 ? [...new Set(addressParts)].join(', ') : null

  return {
    city,
    pinCode: data.postcode?.trim() || null,
    address,
    latitude,
    longitude,
  }
}

export async function fetchCurrentLocation(): Promise<GeocodedLocation> {
  const coordinates = await getDeviceCoordinates()
  return reverseGeocode(coordinates.latitude, coordinates.longitude)
}
