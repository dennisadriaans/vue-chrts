import { defineNuxtModule, createResolver, addComponent, addImports } from '@nuxt/kit'

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
    const { resolve } = createResolver(import.meta.url)

    addComponent({
      name: 'TestComponent',
      filePath: resolve('runtime/components/TestComponent.vue'),
    })
  }
})