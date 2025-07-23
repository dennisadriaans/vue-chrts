import { addComponent } from '@nuxt/kit'
import type { ModuleOptions } from 'nuxt/schema'

export const resolveComponents = (config: ModuleOptions, filePath: string) => {
  const { prefix } = config
  const componentsDir = `${filePath}/components`
  const allComponents = [
    'LineChart',
  ]

  allComponents.forEach((component) => {
    addComponent({
      name: prefix + component,
      mode: 'client',
      filePath: `${componentsDir}/${component}/${component}.vue`,
    })
  })
}
