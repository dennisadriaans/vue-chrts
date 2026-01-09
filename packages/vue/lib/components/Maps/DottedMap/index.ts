// Main component
export { default as DottedMap } from './index.vue'

// Core component (for direct use without pan/zoom controls)
export { default as DottedMapCore } from './core.vue'

// Sub-components
export { default as MapZoomControls } from './MapZoomControls.vue'
export { default as MapLegend } from './MapLegend.vue'

// Types
export * from './types'

// Data
export * from './regions'
export * from './pins'

// Utilities
export * from './mapUtils'
export * from './useMapPanZoom'
