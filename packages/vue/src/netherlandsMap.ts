// Helper to extract the Netherlands GeoJSON feature from the maps data
import mapsData from '../lib/maps.json'

export const netherlandsMap = {
  type: 'FeatureCollection',
  features: (mapsData.features || []).filter((f: any) => f.id === 'NLD'),
}
