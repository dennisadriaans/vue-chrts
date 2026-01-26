import type { MapPin } from './types'

// Default pin styling
export const DEFAULT_PIN_OPTIONS = {
  color: 'var(--ui-text)',
  radius: 0.15
}

// Helper to create a pin with defaults
export function createPin(
  lat: number,
  lng: number,
  data: Record<string, unknown> = {},
  svgOptions: MapPin['svgOptions'] = {}
): MapPin {
  return {
    lat,
    lng,
    svgOptions: { ...DEFAULT_PIN_OPTIONS, ...svgOptions },
    data
  }
}

// Sample world pins organized by region
export const WORLD_PINS: MapPin[] = [
  // North America (USA)
  createPin(40.7128, -74.0060, { city: 'New York', region: 'USA' }),
  createPin(34.0522, -118.2437, { city: 'Los Angeles', region: 'USA' }),
  createPin(41.8781, -87.6298, { city: 'Chicago', region: 'USA' }),
  createPin(25.7617, -80.1918, { city: 'Miami', region: 'USA' }),
  createPin(47.6062, -122.3321, { city: 'Seattle', region: 'USA' }),

  // South America
  createPin(-23.5505, -46.6333, { city: 'São Paulo', region: 'South America' }),
  createPin(-34.6037, -58.3816, { city: 'Buenos Aires', region: 'South America' }),
  createPin(-12.0464, -77.0428, { city: 'Lima', region: 'South America' }),
  createPin(4.7110, -74.0721, { city: 'Bogotá', region: 'South America' }),
  createPin(-33.4489, -70.6693, { city: 'Santiago', region: 'South America' }),

  // Europe
  createPin(48.8566, 2.3522, { city: 'Paris', region: 'Europe' }),
  createPin(51.5074, -0.1278, { city: 'London', region: 'Europe' }),
  createPin(52.5200, 13.4050, { city: 'Berlin', region: 'Europe' }),
  createPin(41.9028, 12.4964, { city: 'Rome', region: 'Europe' }),
  createPin(59.3293, 18.0686, { city: 'Stockholm', region: 'Europe' }),

  // Asia
  createPin(35.6762, 139.6503, { city: 'Tokyo', region: 'Asia' }),
  createPin(1.3521, 103.8198, { city: 'Singapore', region: 'Asia' }),
  createPin(28.6139, 77.2090, { city: 'New Delhi', region: 'Asia' }),
  createPin(31.2304, 121.4737, { city: 'Shanghai', region: 'Asia' }),
  createPin(25.2048, 55.2708, { city: 'Dubai', region: 'Asia' }),

  // Oceania
  createPin(-33.8688, 151.2093, { city: 'Sydney', region: 'Oceania' }),
  createPin(-37.8136, 144.9631, { city: 'Melbourne', region: 'Oceania' }),
  createPin(-36.8485, 174.7633, { city: 'Auckland', region: 'Oceania' }),
  createPin(-27.4705, 153.0260, { city: 'Brisbane', region: 'Oceania' }),
  createPin(-31.9505, 115.8605, { city: 'Perth', region: 'Oceania' })
]

// USA-specific pins with custom colors
export const USA_PINS: MapPin[] = [
  createPin(37.7749, -122.4194, { city: 'San Francisco' }, { color: '#6366f1', radius: 0.3 }),
  createPin(34.0522, -118.2437, { city: 'Los Angeles' }, { color: '#6366f1', radius: 0.3 }),
  createPin(47.6062, -122.3321, { city: 'Seattle' }, { color: '#6366f1', radius: 0.3 }),
  createPin(40.7128, -74.006, { city: 'New York' }, { color: '#f59e0b', radius: 0.3 }),
  createPin(42.3601, -71.0589, { city: 'Boston' }, { color: '#f59e0b', radius: 0.3 }),
  createPin(25.7617, -80.1918, { city: 'Miami' }, { color: '#ec4899', radius: 0.3 }),
  createPin(30.2672, -97.7431, { city: 'Austin' }, { color: '#10b981', radius: 0.3 })
]

// Filter pins by region
export function filterPinsByRegion(pins: MapPin[], region: string): MapPin[] {
  return pins.filter(pin => pin.data?.region === region)
}
