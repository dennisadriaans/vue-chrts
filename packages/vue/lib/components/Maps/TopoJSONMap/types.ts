import type { ColorAccessor, NumericAccessor, StringAccessor } from '@unovis/ts/types/accessor'

export enum MapPointLabelPosition {
  Center = 'center',
  Bottom = 'bottom',
}

export type MapData<AreaDatum = any, PointDatum = any, LinkDatum = any> = {
  areas?: AreaDatum[]
  points?: PointDatum[]
  links?: LinkDatum[]
}

export type MapsData<T extends Record<string, any>, AreaDatum = any, PointDatum = any, LinkDatum = any> = {
  // Required props
  mapFeatureKey: keyof T
  data: MapData<AreaDatum, PointDatum, LinkDatum>
  topojson: any

  // Projection and zoom
  projection?: any // GeoProjection from d3-geo
  zoomFactor?: number
  disableZoom?: boolean
  zoomExtent?: number[]
  zoomDuration?: number
  mapFitToPoints?: boolean

  // Link configuration
  linkWidth?: NumericAccessor<LinkDatum>
  linkColor?: ColorAccessor<LinkDatum>
  linkCursor?: StringAccessor<LinkDatum>
  linkId?: StringAccessor<LinkDatum>
  linkSource?: (l: LinkDatum) => number | string | PointDatum
  linkTarget?: (l: LinkDatum) => number | string | PointDatum

  // Area configuration
  areaId?: StringAccessor<AreaDatum>
  areaColor?: ColorAccessor<AreaDatum>
  areaCursor?: StringAccessor<AreaDatum>

  // Point configuration
  pointColor?: ColorAccessor<PointDatum>
  pointRadius?: NumericAccessor<PointDatum>
  pointStrokeWidth?: NumericAccessor<PointDatum>
  pointCursor?: StringAccessor<PointDatum>
  longitude?: NumericAccessor<PointDatum>
  latitude?: NumericAccessor<PointDatum>
  pointLabel?: StringAccessor<PointDatum>
  pointLabelPosition?: MapPointLabelPosition
  pointLabelTextBrightnessRatio?: number
  pointId?: (d: PointDatum, i: number) => string

  // Heatmap mode
  heatmapMode?: boolean
  heatmapModeBlurStdDeviation?: number
  heatmapModeZoomLevelThreshold?: number

  // Animation
  duration?: number
}