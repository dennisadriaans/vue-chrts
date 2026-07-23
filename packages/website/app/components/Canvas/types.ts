export interface Particle {
  homeX: number
  homeY: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  brightness: number
}

export interface Node {
  id: number
  x: number
  y: number
  width: number
  height: number
  chartKey?: string
  title?: string
  description?: string
}

export enum LegendPosition {
  TopLeft = 'top-left',
  TopCenter = 'top-center',
  TopRight = 'top-right',
  BottomLeft = 'bottom-left',
  BottomCenter = 'bottom-center',
  BottomRight = 'bottom-right'
}

export interface SharedDivider {
  id: string
  type: 'vertical' | 'horizontal'
  pos: number
  start: number
  end: number
  node1Id: number
  node2Id: number
}

export interface AlignmentLine {
  type: 'x' | 'y'
  pos: number
}

export type ResizeDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

export interface CanvasConfig {
  gridSpacing: number
  particleBaseSize: number
  repulsionRadius: number
  repulsionRadiusSq: number
  repulsionStrength: number
  springStrength: number
  damping: number
  panelProximityRadius: number
  panelProximityRadiusSq: number
  panelRepulsionStrength: number
  panelAvoidanceMargin: number
  panelAvoidanceMarginSq: number
  dotOpacity: number
  lineOpacity: number
  baseBrightness: number
  minNodeWidth: number
  minNodeHeight: number
  defaultNodeHeight: number
}

export const CONFIG: CanvasConfig = {
  gridSpacing: 30,
  particleBaseSize: 2.2,
  repulsionRadius: 180,
  repulsionRadiusSq: 180 * 180,
  repulsionStrength: 0.15,
  springStrength: 0.1,
  damping: 0.8,
  panelProximityRadius: 200,
  panelProximityRadiusSq: 200 * 200,
  panelRepulsionStrength: 2.5,
  panelAvoidanceMargin: 15,
  panelAvoidanceMarginSq: 15 * 15,
  dotOpacity: 0.3,
  lineOpacity: 0.015,
  baseBrightness: 0.2,
  minNodeWidth: 200,
  minNodeHeight: 120,
  defaultNodeHeight: 180
}
