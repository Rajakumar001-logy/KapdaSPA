import { useState } from 'react'
import { Crosshair, Loader2 } from 'lucide-react'
import { fetchCurrentLocation, type GeocodedLocation } from '../../lib/location'

interface UseCurrentLocationButtonProps {
  onLocation: (location: GeocodedLocation) => void
  onError?: (message: string) => void
  label?: string
  loadingLabel?: string
  className?: string
  disabled?: boolean
}

export function UseCurrentLocationButton({
  onLocation,
  onError,
  label = 'Use current location',
  loadingLabel = 'Detecting location...',
  className = '',
  disabled = false,
}: UseCurrentLocationButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)

    try {
      const location = await fetchCurrentLocation()
      onLocation(location)
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Could not get your location.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold border border-lavender-300 bg-lavender-50 text-lavender-700 hover:bg-lavender-100 transition-colors disabled:opacity-60 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          <Crosshair className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  )
}
