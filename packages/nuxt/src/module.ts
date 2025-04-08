import { defineNuxtModule, createResolver, addImportsSources, addImports } from '@nuxt/kit'
import { resolveComponents, resolveImports } from "./core"

export interface ModuleOptions {
  /**
   * Prefix for component names
   * @default 'Chrt'
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
    name: '@vue-chrts/nuxt',
    configKey: 'vueChrts',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    prefix: '',
    global: true,
    autoImports: true,
    include: []
  },
  async setup(options, nuxt) {

    const runtimePath = createResolver(import.meta.url).resolve('./runtime/vue-chrts')

    resolveImports(options, runtimePath)
    resolveComponents(options, runtimePath)

    addImportsSources({
      from: 'vue-chrts',
      type: true,
      imports: ['AreaChartItem', 'BulletLegendItemInterface'],
    })

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({
        path: createResolver(import.meta.url).resolve('./types/vue-chrts.d.ts')
      })
    })

  }
})