import { defineNuxtModule, createResolver } from '@nuxt/kit'
import { resolveComponents, resolveImports } from "./core"

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
      nuxt: ">=3"
    }
  },
  defaults: {
    prefix: '',
    global: true,
    autoImports: true,
    include: []
  },
  async setup(options, nuxt) {
    nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps || {}
    nuxt.options.vite.optimizeDeps.include = nuxt.options.vite.optimizeDeps.include || []

    nuxt.options.vite.optimizeDeps.include = ['@unovis/ts', ...nuxt.options.vite.optimizeDeps.include]
    nuxt.options.build.transpile = ['@unovis/ts', ...nuxt.options.build.transpile]

    const { resolve } = createResolver(import.meta.url)

    const runtimePath = resolve('./runtime/vue-chrts')

    resolveImports(options, runtimePath)
    resolveComponents(options, runtimePath)
  }
})