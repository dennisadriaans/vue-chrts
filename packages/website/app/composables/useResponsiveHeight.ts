import { debounce } from 'perfect-debounce'

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type HeightConfig = {
  'default': number
  'sm'?: number
  'md'?: number
  'lg'?: number
  'xl'?: number
  '2xl'?: number
}

const breakpointWidths: Record<Breakpoint, number> = {
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536
}

export function useResponsiveHeight(config: HeightConfig) {
  const height = ref(config.default)

  function getHeight() {
    if (typeof window === 'undefined') {
      return config.default
    }

    const width = window.innerWidth

    // Check breakpoints from largest to smallest
    if (width >= breakpointWidths['2xl'] && config['2xl']) {
      return config['2xl']
    }
    if (width >= breakpointWidths.xl && config.xl) {
      return config.xl
    }
    if (width >= breakpointWidths.lg && config.lg) {
      return config.lg
    }
    if (width >= breakpointWidths.md && config.md) {
      return config.md
    }
    if (width >= breakpointWidths.sm && config.sm) {
      return config.sm
    }

    return config.default
  }
  const debouncedResize = debounce(() => {
    height.value = getHeight()
  }, 50)

  onMounted(() => {
    window.addEventListener('resize', debouncedResize)
    height.value = getHeight()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', debouncedResize)
  })

  return {
    height,
    getHeight
  }
}
