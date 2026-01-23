import type { MapRegion } from './types'

// Region bounding boxes
export const REGIONS: Record<string, MapRegion> = {
  usa: {
    lat: { min: 24, max: 50 },
    lng: { min: -125, max: -66 }
  },
  europe: {
    lat: { min: 20, max: 72 },
    lng: { min: -75, max: 75 }
  },
  asia: {
    lat: { min: -10, max: 55 },
    lng: { min: 60, max: 150 }
  },
  oceania: {
    lat: { min: -50, max: 0 },
    lng: { min: 110, max: 180 }
  }
}

// Country ISO codes by region
export const COUNTRIES: Record<string, string[]> = {
  europe: [
    'FRA', 'DEU', 'BEL', 'NLD', 'LUX', 'CHE', 'AUT', 'CZE', 'POL', 'SVK',
    'HUN', 'SVN', 'ITA', 'ESP', 'PRT', 'GBR', 'IRL', 'DNK', 'SWE', 'FIN',
    'ISL', 'EST', 'LVA', 'LTU', 'HRV', 'SRB', 'BIH', 'MNE', 'MKD', 'UKR', 'BLR'
  ],
  asia: ['CHN', 'IND', 'JPN', 'KOR', 'IDN', 'PAK', 'BGD', 'SAU', 'IRN'],
  usa: ['USA'],
  oceania: ['AUS', 'NZL']
}

// Default zoom levels per region
export const DEFAULT_ZOOM: Record<string, number> = {
  world: 1,
  europe: 0.75,
  asia: 0.5,
  oceania: 0.5,
  usa: 0.5
}
