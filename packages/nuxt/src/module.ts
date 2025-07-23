import {
  defineNuxtModule,
  addComponent,
  createResolver,
  addImports,
} from '@nuxt/kit'
import { resolveComponents } from './runtime/core/components'

export interface ModuleOptions {
  /**
   * Prefix for component names
   * @default ''
   */
  prefix?: string

  /**
   * Register global components
   * @default true
   */
  global?: boolean

  /**
   * Use auto-imports (recommended)
   * @default true
   */
  autoImports?: boolean

  /**
   * Components to include (empty array means all components)
   * @default []
   */
  include?: string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-charts',
    configKey: 'nuxtCharts',
    compatibility: {
      nuxt: '>=3',
    },
  },
  defaults: {
    prefix: '',
    global: true,
    autoImports: true,
    include: [],
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const runtimePath = resolve('./runtime')

    // Optimize @unovis/ts for Vite


    // Register custom LineChart component
    resolveComponents(options, runtimePath)

    const requiredImports = [
      {
        name: 'BulletLegendItemInterface',
        from: '@unovis/ts',
      },
      {
        name: 'CurveType',
        from: '@unovis/ts',
      },
      {
        name: 'Position',
        from: '@unovis/ts',
      },
    ]
    // Register @unovis/vue components that LineChart depends on
    const availableComponents = [
      {
        name: 'VisXYContainer',
        export: 'VisXYContainer',
        filePath: '@unovis/vue',
      },
      { name: 'VisLine', export: 'VisLine', filePath: '@unovis/vue' },
      { name: 'VisAxis', export: 'VisAxis', filePath: '@unovis/vue' },
      {
        name: 'VisBulletLegend',
        export: 'VisBulletLegend',
        filePath: '@unovis/vue',
      },
      { name: 'VisCrosshair', export: 'VisCrosshair', filePath: '@unovis/vue' },
      { name: 'VisTooltip', export: 'VisTooltip', filePath: '@unovis/vue' },
    ]

    availableComponents.forEach((component) => {
      addComponent({
        name: component.name,
        export: component.export,
        filePath: component.filePath,
        mode: 'client',
      })
    })

    requiredImports.forEach((imp) => {
      addImports({ name: imp.name, as: imp.name, from: imp.from })
    })
  },
})
