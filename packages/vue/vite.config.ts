import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tailwindcss from '@tailwindcss/vite'

import type { ModuleFormat, OutputOptions } from 'rollup'

const __dirname = dirname(fileURLToPath(import.meta.url))

import vue from '@vitejs/plugin-vue'

const outputDefault = (format: ModuleFormat, extension: string): OutputOptions => ({
  globals: {
    vue: 'Vue'
  },
  preserveModules: true,
  preserveModulesRoot: './lib',
  format,
  entryFileNames: ({ name }) => {
    return `${name.replace('.vue', '')}.${extension}`
  },
  exports: 'named',
})

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'vue-chrts',
      formats: ['es'],
      // the proper extensions will be added
      fileName: 'index.js',
    },
    rollupOptions: {
      external: ['vue', '@unovis/vue', '@unovis/ts', 'vue-router', 'tailwindcss'],
      output: [outputDefault('es', 'js')],
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  plugins: [vue(), dts(), tailwindcss()]
})
